import type { Metadata } from "next"
import { GalleryConfiguratorPage } from "@modules/configurator"

export const metadata: Metadata = {
  title: "Design Your Memory Frame | Personalized Miniature Art Gallery",
  description:
    "Create a unique Personalized Miniature Art Gallery Memory Frame — choose the size, frame color, wall background, spotlights, decorative photo frames, your own photos, and miniature figurines.",
}

export default function ConfigurePage() {
  return <GalleryConfiguratorPage />
}
