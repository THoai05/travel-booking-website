import { User } from 'src/managements/users/entities/user.entity';

declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: number;
                username: string;
                role: string;
            }
        }
    }
}
