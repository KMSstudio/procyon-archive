// AWS SDK v3
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";

// Initialize DynamoDB Client
const client = new DynamoDBClient({ 
    region: process.env.AWS_REGION,
    credentials: {  accessKeyId: process.env.AWS_ACCESS_KEY,
                    secretAccessKey: process.env.AWS_SECRET_KEY }
});
const dynamoDB = DynamoDBDocumentClient.from(client);
const TABLE_NAME = "Procyon_User_DB";

// Caching
let userCache = new Map(), cacheTimestamps = new Map();
const CACHE_TTL = 60 * 60 * 1000; // 60 minutes

/**
 * Fetch user from DynamoDB (cache applied)
 */
export async function fetchUser(email) {
    const now = Date.now();
    if (userCache.has(email) && now - cacheTimestamps.get(email) < CACHE_TTL) return userCache.get(email);

    try {
        const { Item } = await dynamoDB.send(new GetCommand({
            TableName: TABLE_NAME,
            Key: { email },
            ProjectionExpression: "lastAccessDate, lastContributionDate, isAdmin"
        }));
        if (!Item) return null;
        userCache.set(email, Item), cacheTimestamps.set(email, now);
        return Item;
    } catch (error) {
        console.error(`Error fetching user ${email}:`, error);
        throw error;
    }
}

/**
 * Save user to DynamoDB (cache applied)
 */
export async function saveUser(email, data) {
    if (!email || !data) return;
    if (JSON.stringify(userCache.get(email)) === JSON.stringify(data)) return;

    try {
        await dynamoDB.send(new PutCommand({ TableName: TABLE_NAME, Item: { email, ...data } }));
        userCache.set(email, data), cacheTimestamps.set(email, Date.now());
    } catch (error) {
        console.error(`Error saving user ${email}:`, error);
        throw error;
    }
}

/**
 * Update last access date
 */
export async function updateUserAccess(email) {
    if (!email) return;
    const today = new Date().toISOString().split('T')[0], user = await fetchUser(email);

    if (!user) await saveUser(email, { lastAccessDate: today, lastContributionDate: '1990-10-13', isAdmin: false });
    else if (user.lastAccessDate !== today) user.lastAccessDate = today, await saveUser(email, user);
}