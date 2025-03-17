// AWS SDK v3
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";

// Initialize DynamoDB Client
const client = new DynamoDBClient({ 
    region: process.env.AWS_PRCY_REGION,
    credentials: {  
        accessKeyId: process.env.AWS_PRCY_ACCESS_KEY,
        secretAccessKey: process.env.AWS_PRCY_SECRET_KEY 
    }
});
const dynamoDB = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.AWS_DB_USER_TABLE;

// Caching
let userCache = new Map(), cacheTimestamps = new Map();
const CACHE_TTL = (process.env.TTL_USER_DB).split('*').map(Number).reduce((acc, val) => acc * val, 1);

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
        userCache.set(email, {...Item}), cacheTimestamps.set(email, now);
        return Item;
    } catch (error) {
        console.error(`Error fetching user ${email}:`, error);
        throw error;
    }
}

/**
 * Check if user exists in DynamoDB (cache applied)
 */
export async function isUserExist(email) {
    if (!email) return false;
    const user = await fetchUser(email);
    return user !== null;
}

/**
 * Save user to DynamoDB (cache applied)
 */
export async function saveUser(email, data) {
    if (!email || !data) return;
    console.log(`userChache: ${JSON.stringify(userCache.get(email))}`);
    console.log(`data: ${JSON.stringify(data)}`);
    if (JSON.stringify(userCache.get(email)) === JSON.stringify(data)) { return; }

    try {
        await dynamoDB.send(new PutCommand({ TableName: TABLE_NAME, Item: { email, ...data } }));
        userCache.set(email, {...data}), cacheTimestamps.set(email, Date.now());
    } catch (error) {
        console.error(`Error saving user ${email}:`, error);
        throw error;
    }
}

/**
 * Update last access date
 */
export async function updateUserAccess(email) {
    console.log(`updateAccessDate ${email}`);
    if (!email) return;
    const today = new Date(Date.now() + 9*3600*1000).toISOString().split('T')[0], user = await fetchUser(email);
    console.log(`update Access date: ${email} ${today}`)
    if (!user) await saveUser(email, { lastAccessDate: today, lastContributionDate: '1990-10-13', isAdmin: false });
    else if (user.lastAccessDate != today) { user.lastAccessDate = today, await saveUser(email, user); }
}

/**
 * Fetch all users from DynamoDB (cache applied)
 */
export async function fetchAllUser() {
    const now = Date.now();
    if (userCache.has("all_users") && now - cacheTimestamps.get("all_users") < CACHE_TTL) { return userCache.get("all_users"); }
    try {
        const { Items } = await dynamoDB.send(new ScanCommand({
            TableName: TABLE_NAME,
            ProjectionExpression: "email, lastAccessDate, lastContributionDate, isAdmin"
        }));
        
        if (!Items) return [];
        userCache.set("all_users", Items), cacheTimestamps.set("all_users", now);
        return Items;
    } catch (error) {
        console.error("Error fetching all users:", error);
        throw error;
    }
}