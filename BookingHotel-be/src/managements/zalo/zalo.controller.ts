import { Controller, Get } from '@nestjs/common';
import axios from 'axios';

@Controller('zalo')
export class ZaloController {
    @Get('check')
    async checkOA() {
        try {
            const res = await axios.get('https://zalo.me/3529527218239680058');
            if (res.status === 200) {
                return { status: 'active' };
            }
            return { status: 'inactive' };
        } catch {
            return { status: 'error' };
        }
    }
}
