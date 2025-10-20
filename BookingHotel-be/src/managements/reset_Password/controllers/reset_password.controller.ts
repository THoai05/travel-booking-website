import { Controller } from '@nestjs/common';
import { ResetPasswordService } from '../services/reset_password.service';

@Controller('reset-password')
export class ResetPasswordController {
  constructor(private readonly resetPasswordService: ResetPasswordService) {}
}
