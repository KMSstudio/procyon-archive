import fs from 'fs';
import path from 'path';

const configPath = path.join(process.cwd(), 'src/config');

/**
 * JSON 설정 파일을 불러오는 함수
 * @param {string} fileName - 불러올 JSON 파일 이름
 * @returns {Object} - JSON 데이터 객체
 */
export function loadConfig(fileName) {
    try {
        const filePath = path.join(configPath, `${fileName}.json`);
        const jsonData = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(jsonData);
    } catch (error) {
        console.error(`${fileName}.json 로드 실패:`, error);
        return {};
    }
}