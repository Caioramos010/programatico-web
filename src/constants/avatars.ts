// Lista de avatares padrões disponíveis no picker de perfil.
// Para adicionar novos: coloque o arquivo em /public/avatars/ e
// inclua o nome do arquivo no array abaixo.
export const DEFAULT_AVATARS: string[] = [
  // "avatar-01.png",
  // "avatar-02.png",
  // "avatar-03.png",
];

export const avatarUrl = (filename: string) => `/avatars/${filename}`;
