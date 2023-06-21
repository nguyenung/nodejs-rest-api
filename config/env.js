import { config } from 'dotenv';

const loadEnvironmentVariables = () => {
    config()
    const environment = process.env.NODE_ENV || 'local'
    config({ path: `.env.${environment}` })
};

export default loadEnvironmentVariables
