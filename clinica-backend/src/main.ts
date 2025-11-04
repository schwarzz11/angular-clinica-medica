import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SeedService } from './seeds/services/seed.service'; // <-- Importe o SeedService

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. CORS (Item 6.9)
  app.enableCors({
    origin: 'http://localhost:4200',
    credentials: true,
  });

  // 2. Prefixo Global da API (Item 3.2)
  app.setGlobalPrefix('api/v1', {
    exclude: ['/metrics'], // Exclui a rota /metrics do prefixo
  });

  // 3. Validation Pipe Global (Usa class-validator)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // --- INÍCIO DO SEED (Item 3.5) ---
  // Apenas em ambiente de desenvolvimento
  if (process.env.NODE_ENV !== 'production') {
    const seedService = app.get(SeedService); // Pega o serviço
    await seedService.runSeeds(); // Executa os seeds
  }
  // --- FIM DO SEED ---

  // O NestJS rodará na porta 3000 por padrão
  await app.listen(3000);
}

// Lidar com a promessa do bootstrap
bootstrap().catch((err) => {
  console.error('Erro ao inicializar o servidor NestJS:', err);
  process.exit(1);
});
