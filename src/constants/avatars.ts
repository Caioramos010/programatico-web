// Lista de avatares padrões disponíveis no picker de perfil.
// Para adicionar novos: coloque o arquivo em /public/avatars/ e
// inclua o nome do arquivo no array abaixo.
export const DEFAULT_AVATARS: string[] = [
  "dalmata.png",
  "gato.png",
  "coruja.png",
  "urso.png",
  "lobo.png",
  "jacare.png",
];

export const avatarUrl = (filename: string) => `/avatars/${filename}`;
