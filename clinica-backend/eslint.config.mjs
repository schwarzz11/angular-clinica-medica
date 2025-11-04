// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs', 'dist/'], // Adicionei 'dist/' (boas práticas)
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked, // Esta é a config rigorosa
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    // Aplicar estas regras apenas a arquivos TypeScript
    files: ['**/*.ts'],
    rules: {
      // --- SUAS REGRAS EXISTENTES ---
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      'prettier/prettier': ['error', { endOfLine: 'auto' }],

      // --- NOVAS REGRAS PARA DESATIVAR OS 16 AVISOS ---

      // Corrige erros "basic-types" em DTOs (ex: 'cep: string;')
      // O linter acha 'string' óbvio, mas em DTOs é bom ser explícito.
      '@typescript-eslint/no-inferrable-types': 'off',

      // Corrige erros "function-return-type"
      // Exige que toda função tenha um tipo de retorno (ex: ': void')
      '@typescript-eslint/explicit-function-return-type': 'off',

      // Regra similar que desativa a necessidade de tipos em
      // parâmetros de função e funções exportadas (corrige o decorator)
      '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
  },
);
