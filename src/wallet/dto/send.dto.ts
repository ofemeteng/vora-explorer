import { IsString, IsNumberString } from 'class-validator';

export class SendDto {
    @IsString()
    recipient: string;

    @IsNumberString()
    amount: string;
}