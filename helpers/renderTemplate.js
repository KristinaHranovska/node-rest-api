import ejs from 'ejs';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';

const renderFile = promisify(ejs.renderFile);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const renderTemplate = async (templateName, data) => {
    const templatePath = path.join(__dirname, '../views', `${templateName}.ejs`);
    return renderFile(templatePath, data);
};

export default renderTemplate;