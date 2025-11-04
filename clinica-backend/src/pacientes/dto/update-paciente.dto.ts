import { PartialType } from '@nestjs/mapped-types'; // Pacote já instalado pelo Nest
import { CreatePacienteDto } from './create-paciente.dto';

// O Update DTO é um 'Create' onde todos os campos são opcionais.
export class UpdatePacienteDto extends PartialType(CreatePacienteDto) {}
