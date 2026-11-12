/**
 * VIDEO – länkar till videor på sidan (förklaringsvideon och kundvideor).
 * Används av komponenter/ui/Videospelare.tsx.
 */

/**
 * Gör om en YouTube- eller Vimeo-länk till en inbäddningsadress, i lägen som
 * inte spårar besökaren (youtube-nocookie, Vimeo med dnt=1). null om länken
 * inte är YouTube eller Vimeo – då spelas den som en vanlig videofil (mp4).
 */
export function inbaddning(url: string): string | null {
  const youtube = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{6,})/);
  if (youtube) return `https://www.youtube-nocookie.com/embed/${youtube[1]}?rel=0`;
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}?dnt=1`;
  return null;
}
