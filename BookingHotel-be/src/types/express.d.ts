import { User } from 'src/managements/users/entities/user.entity';

declare global {
    namespace Express {
        interface Request {
            user?: {
                sub: number;
                username: string;
                role: string;
            }
        }
    }
}
