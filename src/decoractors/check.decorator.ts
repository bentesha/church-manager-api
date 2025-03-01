import { Reflector } from '@nestjs/core';

export const CHECK_ACTION_METADATA = 'CHECK_ACTION_METADATA';

export const Check = Reflector.createDecorator<string>();
