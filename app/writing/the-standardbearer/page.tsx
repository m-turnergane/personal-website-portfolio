import type { Metadata } from "next";
import { StandardbearerPoem } from "./poem-content";

export const metadata: Metadata = {
  title: "An Elegy of the Nameless Brave: The Standardbearer",
  description:
    "A blank-verse elegy told through the voice of a nameless soldier bearing his nation's standard into a mythic battle. A companion poem to Sacrifice of the Sinspars — a meditation on fear, legacy, and the price of peace.",
  openGraph: {
    title: "An Elegy of the Nameless Brave: The Standardbearer",
    description:
      "A blank-verse companion poem to Sacrifice of the Sinspars, told through the voice of a nameless soldier bearing his nation's standard into battle.",
    images: [
      {
        url: "/images/writing/the-standardbearer/Section 1 - Cinematic.png",
        width: 1200,
        height: 630,
        alt: "The Standardbearer — cinematic artwork",
      },
    ],
  },
};

export default function StandardbearerPage() {
  return <StandardbearerPoem />;
}
