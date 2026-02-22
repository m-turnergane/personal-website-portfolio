"use client";

import { Fragment, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────────

interface PoemSection {
  id: string;
  numeral: string;
  title: string;
  image: string;
  isQuoted?: boolean;
  verses: Array<string | { refrain: string }>;
}

// ─── Poem Data ──────────────────────────────────────────────────────────────────

const SECTIONS: PoemSection[] = [
  {
    id: "stillness-before",
    numeral: "I",
    title: "Stillness Before",
    image: "/images/writing/the-standardbearer/Section 1 - Cinematic.png",
    verses: [
      `Clouds as leaden as iron—the sentinels of the sky,
With a desolate stare, on this desolate earth,
I stared deep into the cobalt within.
I lay upon this plain, watching the clouds
Mimic my thoughts, then melt and gather anew.
No hand may conjure this peace; it must be found.`,
      `So I held close its brief and fragile shape,
And watched a chilled sun hound the heart of night,
Till heaven turned to a lurid, wounded blue.
Far off within the recesses of my mind,
Emptiness is the master of a domain silent and still.
Thoughts filled the void, there rose the voice of my sire:`,
    ],
  },
  {
    id: "fathers-doctrine",
    numeral: "II",
    title: "Father\u2019s Doctrine",
    image: "/images/writing/the-standardbearer/Section 2 - Cinematic.png",
    isQuoted: true,
    verses: [
      `\u201C**War \u2014 Harbinger of Death** \u2014 beckons us all
Irresistible, men will always heed its call.
For it comes silently, veiled by thin shroud,
And grips its beholder like a vice once found.`,
      `But what could you know of such calamity?
Infinite its desire, consuming all it invites
Though insatiable its appetite,
One claims its descendency
A brief respite from its mortal tendency.`,
      `**Lady Peace** \u2014 like a new summer\u2019s sun,
Melts away its shackles of ice,
And provides refuge  for acts never undone.
Men guard it well, for few will dare to trace
Its mother\u2014war\u2014and meet her iron face,
And what can you know of war? I knew it first;
I watched it quench its bloody thirst.
It is the realm of desolation\u2014unyielding, stark;
It beckons the brave with whispers from the dark.`,
      `You have yet to feel death\u2019s cold, enfolding hand,
Where hope turns from the hearts she cannot stand.
It seeps in bone, it settles, deep and sore,
And takes men long before their intended score.
Yet once, I fought to carve this peace you keep;
Remember: peace is earned with waking sleep.`,
      `You are the heir of desolation\u2019s line;
So bask amid this quiet\u2014though brief\u2014and call it fine.
For men like us, such mercy comes but rare;
So take its warmth, yet keep your harness there.
There is a time for peace, **a time for war**;
Cling loose to peace\u2014then muster evermore.`,
      `Lift high the name our fathers bore long before;
Stand fast, my son\u2014\u002Dso it may live on, forevermore.\u201D`,
    ],
  },
  {
    id: "the-speck-the-arrow",
    numeral: "III",
    title: "The Speck, The Arrow",
    image: "/images/writing/the-standardbearer/Section 3 - Cinematic.png",
    verses: [
      `If only he were here now, not mere words,
Reverberating in my mind\u2019s deep hollowed vault;
His utterance, my guide, I heeded him.
And so, I drank this ephemeral peace,
Aware how rare, how narrow its expanse.
The sun lit grey clouds, overcast and drear;
Then broke behind one thinning, drifting shroud,
And spilled a fiery rivulet of light
Across my gaze. I closed my eyes in awe.`,
      { refrain: "Please never fade \u2014 oh, beautiful, beautiful quiet day." },
      `I unclenched my eyes, the world\u2019s colour set
To behold a sight I\u2019d never seen in years.
What a peculiar discovery\u2014look:
A faint black speck, suspended in the Sun.
I watched, as curiosity held me fast,
And wondered why, in all my years, I had missed
What now made plain, in the blindness of my gaze.`,
      `Until it came close enough to take
The sharpened silhouette of an arrow,
Planting itself in the earth beside my brow,
Whispering the wind\u2019s song into my ear,
Indifferent to who might hear its music.
*\u201CA time for war \u2026\u201D* my father\u2019s whisper came,
A faint bellow under that overture.`,
      `Pertinacity took shape as human hands
As if they clasped my gorget hauling me
To stand again. And I felt my heart
Collapse down to my core\u2014why now? Why now
Does courage flee this vanquished heart of mine?
Inwardly I cursed its untimely frailty;
Yet this scene I saw was scarcely tenable.`,
    ],
  },
  {
    id: "revealed-slaughter",
    numeral: "IV",
    title: "Revealed Slaughter",
    image: "/images/writing/the-standardbearer/Section 4 - Cinematic.png",
    verses: [
      `For I\u2014who moments since drank blissful peace\u2014
Lay in a meadow plagued by calamity,
Fortunate that my rest had been but brief;
For this was a final resting-place for most.
As the bodies of conscious creatures
Young men of dreams and promise\u2014now lay hewn
Like cattle set for slaughter, by the craft
Of devious devices forged of their own kind.`,
      `That once-wonderous dawn of the sky had married
The crimson of the ground\u2014till heaven\u2019s blue
And lifeblood met, and mingled, and became one.
As the life-essence of a thousand men,
Once a flame and fuel for the living
Was now all but a visage of death; as the artist
Wields the brush to paint upon tapestry,
Gruesome warriors wielding sword and shield,
In smoke and cries, had stained that illustrious sky.`,
      `Begrudgingly I\u2014reached into the plain
To pick from the earth our country\u2019s fallen standard,
And steeled this wretched heart of mine\u2014for now
Was not the hour for cowardice to breathe.
And so, I plunged once more into the fray,
This grand cacophony of violence
Bearing the standard of our forefathers \u2014
Dragging my heavy feet, one after one,
Wearing a mask of dauntless on my face,
Urging men-at-arms on, suffering every inch.`,
      { refrain: "Please, fade \u2014 oh, dreary, dreary desolate day," },
    ],
  },
  {
    id: "standardbearer-in-the-press",
    numeral: "V",
    title: "The Standardbearer in the Press",
    image: "/images/writing/the-standardbearer/Section 5 - Cinematic.png",
    verses: [
      `One after one\u2014a thousand strong\u2014we moved;
We marched to meet a drum that bellowed loud.
We met our adversary, gave no quarter,
We fought upon the hilltop, fought the plain;
We fought upon the riverbed laid bare,
And fought on desecrated, broken earth.`,
      `Even I\u2014**the Standardbearer**\u2014joined the press,
And slew a foe with shuddering disregard.
Death\u2019s icy grip, like iron in a vice,
Laid him to rest with comfort only steel\u2014
The edge of my blade flaying through his breast.
His heart bled out where once a field was green;
This graveyard swallowed all his mind in full.`,
      `I shivered, knowing I could deal with such horror.
Yet clamouring of steel and cries swept on,
And drowned out reason\u2014so I became dread\u2019s hand,
The deliverance of terror, and its thrall.`,
      `And though we slew so many in that churn
I could not shake the sense that the tide turned.
I read it in my brethren\u2019s hollowed eyes,
And saw the fire-bellied in their souls diminish.
It would not be long before mine, too, went out.`,
      `For thick had grown the air with iron\u2019s breath,
And every gust bore ash and guttural prayer.
The heavens, once a cobalt sanctuary,
Now watched like tempered steel\u2014unblinking, cold,
As if the Gods themselves held back their hands
To see what Men would make of Men, again.`,
    ],
  },
  {
    id: "wound-shame-the-dip",
    numeral: "VI",
    title: "Treason of the Heart",
    image: "/images/writing/the-standardbearer/Section 6 - Cinematic 2.png",
    verses: [
      `A horn cried out \u2014 then choked upon the din;
Commands were flung like pebbles in a storm.
I saw our line, a wall of stitched resolve,
Unravel at the seams of weary limbs,
And in the eyes of brethren \u2014 hollowed out \u2014
Did Hope, that timid maiden, turn away.`,
      `O father \u2014 have you foreseen this very turn?
*\u201CCling loosely to the former,\u201D* you once said,
*\u201CAnd muster for the latter.\u201D* Look! I mustered \u2014
Yet muster is but posture without flame.
For courage, when it falters in the chest,
Is a sword that breaks \u2014 and hands that shake.`,
      `Then came a hush \u2014 not peace, but breathless dread,
That dreadful stillness war affords at times,
When each man hears at last his private heart,
And finds it pounding treason through his ribs.
My fingers tightened on our forebears\u2019 pole,
As if the wood itself could anchor me.`,
      `A sudden hiss \u2014 the whisper of the wind
Recalled that omen arrow at my brow;
And as if Fate had practiced once before,
Another darkness leapt from the distant sky.
It kissed my shoulder \u2014 buried to the flesh \u2014
And fire poured through sinew, bright and raw.`,
      `I staggered; earth rose up to meet my knee.
The standard swayed \u2014 a mighty, mortal thing,
No longer symbol only, but a weight,
A living burden forged of a thousand names.
I tasted copper; heard the river\u2019s roar
Though none was near \u2014 but blood within my ears.`,
      `Why now, does courage flee this vanquished heart?
Why now, when all my father\u2019s words stand near?
I sought to stand \u2014 and yet my heel betrayed,
As if the soil itself, grown fat with death,
Would keep what it had taken, keep me too,
And claim my oath along with broken men.`,
      `In that one instant \u2014 shame, like winter, came.
Not fear of dying \u2014 no, that fear was old \u2014
But fear of failing what my sire had sown;
Of living half a breath as less than man.
For what is war, if not a ruthless judge,
That measures all by what they\u2019ve done when torn?`,
      `And there, amid the crush of fleeing forms,
I felt the pull \u2014 that ancient, sinful pull \u2014
To turn from banners, turn from bleeding cries,
To trade the legacy of blood and bone
For one more heartbeat\u2019s counterfeit of peace.
Ah, peace \u2014 the off-spring of a brutal womb \u2014
How quickly it becomes counterfeit in war.`,
      `My arms grew slack. The standard dipped and leaned.`,
    ],
  },
  {
    id: "the-nephrite-eyed-verdict",
    numeral: "VII",
    title: "The Nephrite-Eyed Verdict",
    image: "/images/writing/the-standardbearer/Section 7 - Cinematic.png",
    verses: [
      `The sigil shuddered \u2014 not from wind, but fragility,
And as it bowed, as if in bleak farewell,
A shadow crossed my sight \u2014 a man drew near,
Not borne by panic, not by desperate haste,
But moving like a verdict through the smoke.`,
      `Into this man\u2019s nephrite eyes \u2014 violent, gruesome \u2014
Did I find security entwined with spite;
A bitter sanctum in a bitter world,
As though malignity could mask the truth
That he, alone, still carried living flame
Where ours had drowned \u2014 in fear and mud.`,
      `Could this be the final bastion of the hopes of a people?
Amid a leer which spoke the tongue of carnage,
I \u2014 shamefully \u2014 found solace in such ruin;
For there are moments desolation births
A hideous kind of comfort in the strong:
A promise that not all shall cower and crack.`,
      `As if distilled into this man by Gods,
Did I, for the first time upon this day,
Feel but a sliver of Hope burn anew?
Not gentle Hope of meadow, cloud, and calm \u2014
But Hope made hard \u2014 a flint within the fist,
That strikes its light by violence, if it must.`,
      `He did not speak \u2014 yet spoke his gaze enough,
Piercing through marrow, measuring my soul.
And I, who bore the standard of my sires,
Felt all my fathers standing at my back \u2014
Not to condemn, but to command: release.`,
      `So relinquished did I the forebears\u2019 standard,
Not cast aside in cowardice alone,
But offered \u2014 like a torch to steadier hands \u2014
That this man should shoulder what I could not.
My grip unknotted; timber left my palm.
And in that letting-go I understood:
**Some legacies are saved by yielding them.**`,
      `He took the pole as if it weighed him naught.
Then with one hand he braced me \u2014 kept me from
The greedy mouth of soil that yearned for more.
And gently \u2014 oh, impossibly \u2014 he laid
My failing form upon torn, trampled earth,
As one might lay a brother down to sleep.`,
      `Above, the Sun began its weary fall,
And all the day\u2019s red sins climbed up the clouds.
I watched this man \u2014 emerald-eyed, unshaken \u2014
Bear the standard of our very nation
Unto the ridge beyond; the blood-red sun
A crown behind his frame, his cloak in wind,
A single figure cut against the blaze.`,
      `And into the fray \u2014 one against many \u2014
Did the sigil of our forefathers fly,
As if the cloth remembered every oath
And found again its purpose in the air.
He plunged where steel converged like starving jaws,
And still the banner did not bend or die.`,
      `Then \u2014 like thunder answering distant storm \u2014
A thousand more rose up behind that sign.
Not summoned by a lord\u2019s thin-lunged command,
But dragged by image \u2014 by that savage grace
Of one man standing when the rest would break.
Inspired, they surged; the valley shook with feet.`,
      `I, however, lay once more in that meadow,
Despite a longing burning to arise.
The blood that once coursed these veins was now
Drunk deep by earth \u2014 as if the plain itself
Desired my life to feed its crimson art.
Yet fear nor bliss set in \u2014 nor pain nor grief \u2014
Not even sound itself; silence my companion.`,
      `And as cold death drew spirit from my flesh,
I felt again that hollow in my mind
Where Father\u2019s voice had dwelt these many years.
No longer echo \u2014 no longer distant counsel \u2014
But presence, warm as hearth beyond the dark,
Summoning me home from fields of bone.`,
      `So, in the last dim margin of my sight,
I held that image \u2014 banner, cloak, and ridge \u2014
As if to name it was to make it true:
That legacy may live though I depart,
That courage may be carried when I fall,
That peace may come \u2014 not found, but dearly bought.`,
      { refrain: "Please never fade \u2014 oh, beautiful, beautiful immaculate day." },
    ],
  },
];

// ─── Markup Helpers ─────────────────────────────────────────────────────────────

function parseLine(line: string): React.ReactNode {
  const parts = line.split(/(\*\*.*?\*\*|\*[^*]+?\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="text-white font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("*") && part.endsWith("*") && !part.startsWith("**")) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

function renderVerse(
  verse: string | { refrain: string },
  idx: number,
  isQuoted?: boolean
) {
  if (typeof verse === "object" && "refrain" in verse) {
    return (
      <p
        key={idx}
        className="font-poem text-[1.15rem] md:text-[1.35rem] leading-[1.9] text-white/90 text-center italic my-10 md:my-14"
        style={{ textShadow: "0 2px 12px rgba(0,0,0,0.7)" }}
      >
        {verse.refrain}
      </p>
    );
  }

  const lines = verse.split("\n");
  return (
    <p
      key={idx}
      className={`font-poem text-[1.1rem] md:text-[1.25rem] leading-[1.9] text-white/85 mb-7 ${
        isQuoted ? "italic" : ""
      }`}
      style={{ textShadow: "0 1px 8px rgba(0,0,0,0.6)" }}
    >
      {lines.map((line, i) => (
        <Fragment key={i}>
          {i > 0 && <br />}
          {parseLine(line)}
        </Fragment>
      ))}
    </p>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────────

export function StandardbearerPoem() {
  const sectionContentRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("poem-section-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -5% 0px" }
    );

    sectionContentRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative" style={{ zIndex: 1 }}>
      {/* ── Header ──────────────────────────────────────────────── */}
      <header className="relative pb-12 md:pb-20">
        <Link
          href="/writing"
          className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mb-10"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Writing
        </Link>

        <p className="font-poem text-sm md:text-base tracking-[0.15em] uppercase text-neutral-500 mb-3">
          An Elegy of the Nameless Brave
        </p>
        <h1 className="font-poem text-4xl md:text-6xl lg:text-7xl font-semibold text-white leading-[1.1] mb-6">
          The Standardbearer
        </h1>
        <p className="text-neutral-400 text-sm md:text-base leading-relaxed max-w-2xl mb-6">
          A blank-verse companion poem to{" "}
          <a
            href="https://www.amazon.ca/Sacrifice-Sinspars-Short-Tale-Illandria-ebook/dp/B0FZY2GZ2G"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-300 underline underline-offset-2 hover:text-white transition-colors"
          >
            <em>Sacrifice of the Sinspars</em>
          </a>{" "}
          — a meditation on fear, legacy, and the price of peace.
        </p>
        <time className="text-neutral-500 text-sm">February 22, 2026</time>

        {/* ── Preface ──────────────────────────────────────────── */}
        <div className="mt-10 border border-white/10 rounded-xl bg-white/[0.02] p-6 md:p-8 max-w-2xl">
          <h2 className="text-xs tracking-[0.2em] uppercase text-neutral-500 mb-4">
            Author&rsquo;s Preface
          </h2>
          <div className="space-y-4 text-neutral-400 text-sm md:text-[0.938rem] leading-relaxed">
            <p>
              <em>The Standardbearer</em> is a companion poem inspired by a
              battle vignette from my brother&rsquo;s story lore. (I encourage
              everyone to check out the short story he published as an ebook for
              the complete context of the scene depicted in this poem&nbsp;—{" "}
              <a
                href="https://www.amazon.ca/Sacrifice-Sinspars-Short-Tale-Illandria-ebook/dp/B0FZY2GZ2G"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-300 underline underline-offset-2 hover:text-white transition-colors"
              >
                <em>Sacrifice of the Sinspars</em>
              </a>{" "}
              by Mark Gane.)
            </p>
            <p>
              I wanted to take a different view of the main battle illustrated in
              the story, told not through the eyes of a hero, but through the
              body and mind of someone ordinary: a soldier tasked with carrying
              the nation&rsquo;s banner. This is that soldier&rsquo;s account
              &mdash; a moment of stillness shattered, a banner turned from
              symbol into weight, and a quiet reckoning with fear, shame, and
              inheritance.
            </p>
            <p>
              I wanted the language to feel mythic yet intimate, as if legend is
              forming in real time from mud, fear, and duty. The form leans into
              a loose blank-verse cadence&nbsp;&mdash; sometimes measured,
              sometimes breaking&nbsp;&mdash; because war doesn&rsquo;t keep
              meter, and neither does the heart. What begins as a plea for a
              quiet day becomes a meditation on legacy: how courage falters, how
              symbols outlive us, and how peace is never merely found&nbsp;&mdash;
              it&rsquo;s paid for.
            </p>
          </div>
        </div>
      </header>

      {/* ── Tapestry ────────────────────────────────────────────── */}
      <div className="poem-full-bleed">
        {SECTIONS.map((section, i) => (
          <section
            key={section.id}
            className="relative overflow-hidden"
          >
            {/* Background artwork */}
            <div className="absolute inset-0">
              <Image
                src={section.image}
                alt=""
                fill
                className="object-cover"
                sizes="100vw"
                priority={i < 2}
              />
              {/* Gradient overlay for readability + edge blending */}
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(
                    to bottom,
                    rgba(10,10,10,0.92) 0%,
                    rgba(10,10,10,0.55) 12%,
                    rgba(0,0,0,0.38) 50%,
                    rgba(10,10,10,0.55) 88%,
                    rgba(10,10,10,0.92) 100%
                  )`,
                }}
              />
            </div>

            {/* Section content */}
            <div
              ref={(el) => {
                sectionContentRefs.current[i] = el;
              }}
              className="poem-section relative z-10 min-h-screen flex flex-col justify-center py-20 md:py-28 px-6"
            >
              <div className="max-w-2xl mx-auto w-full">
                {/* Section header ornament */}
                <div className="text-center mb-10 md:mb-14">
                  <span className="font-poem text-sm tracking-[0.3em] text-white/40">
                    {section.numeral}
                  </span>
                  <div className="text-white/20 my-3 text-[0.65rem] tracking-[0.5em]">
                    ── ✦ ──
                  </div>
                  <h2 className="font-poem text-[0.8rem] md:text-[0.85rem] tracking-[0.2em] uppercase text-white/45">
                    {section.title}
                  </h2>
                </div>

                {/* Verses */}
                <div>
                  {section.verses.map((verse, vi) =>
                    renderVerse(verse, vi, section.isQuoted)
                  )}
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer className="relative pt-16 pb-8">
        <Link
          href="/writing"
          className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Writing
        </Link>
      </footer>
    </div>
  );
}
