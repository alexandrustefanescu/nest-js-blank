import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller()
export class AuthController {
  constructor(
    private _authService: AuthService,
  ) {}

  @Post('signup')
  signUp(
    @Body() dto: AuthDto
  ) {
    return this._authService.signUp(dto);
  }

  @Post('signin')
  signIn(@Body() dto: AuthDto) {
    return this._authService.signIn(dto);
  }
}
