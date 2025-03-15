// envelope.dto.ts
export class CreateEnvelopeDto {
  startNumber: number;
  endNumber: number;
}

export class DeleteEnvelopeDto {
  startNumber: number;
  endNumber: number;
}

export class AssignEnvelopeDto {
  memberId: string;
}
