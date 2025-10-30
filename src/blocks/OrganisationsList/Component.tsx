"use client";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

interface CardData {
  title: string;
  link: string;
  background: string;
  tags: Array<string>;
}

const LIST: Array<CardData> = [
  // 12 organisations au total
  {
    title: "Cabinet d'avocats spécialisé en droit des affaires",
    link: "#",
    background: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/simone-hutsch-5oYbG-sEImY-unsplash.jpg",
    tags: ["Droit des affaires", "Conseil juridique", "Paris"],
  },
  {
    title: "Organisation de médiation et conciliation",
    link: "#",
    background: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/simone-hutsch-o9F8dRoSucM-unsplash.jpg",
    tags: ["Médiation", "Résolution de conflits", "Lyon"],
  },
  {
    title: "Association de défense des droits",
    link: "#",
    background: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/simone-hutsch-K1W9OjEgacI-unsplash.jpg",
    tags: ["Défense des droits", "Accès au droit", "Marseille"],
  },
  {
    title: "Centre d'aide juridique gratuite",
    link: "#",
    background: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/simone-hutsch-gDmVqxZt1hg-unsplash.jpg",
    tags: ["Aide juridique", "Gratuit", "Toulouse"],
  },
  {
    title: "Syndicat professionnel des notaires",
    link: "#",
    background: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/simone-hutsch-sutfgh5DNIU-unsplash.jpg",
    tags: ["Notariat", "Professionnel", "Lille"],
  },
  {
    title: "Fondation pour l'accès au droit",
    link: "#",
    background: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/simone-hutsch-ZXLGP2Qh3Mo-unsplash.jpg",
    tags: ["Fondation", "Accès au droit", "Bordeaux"],
  },
  {
    title: "Cabinet d'avocats spécialisé en droit pénal",
    link: "#",
    background: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/simone-hutsch-5oYbG-sEImY-unsplash.jpg",
    tags: ["Droit pénal", "Défense", "Nantes"],
  },
  {
    title: "Association d'aide aux victimes",
    link: "#",
    background: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/simone-hutsch-o9F8dRoSucM-unsplash.jpg",
    tags: ["Victimes", "Accompagnement", "Strasbourg"],
  },
  {
    title: "Ordre des avocats de Paris",
    link: "#",
    background: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/simone-hutsch-K1W9OjEgacI-unsplash.jpg",
    tags: ["Ordre", "Avocats", "Paris"],
  },
  {
    title: "Centre de formation juridique",
    link: "#",
    background: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/simone-hutsch-gDmVqxZt1hg-unsplash.jpg",
    tags: ["Formation", "Juridique", "Rennes"],
  },
  {
    title: "Observatoire des droits de l'homme",
    link: "#",
    background: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/simone-hutsch-sutfgh5DNIU-unsplash.jpg",
    tags: ["Droits de l'homme", "Observatoire", "Montpellier"],
  },
  {
    title: "Union des jeunes avocats",
    link: "#",
    background: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/simone-hutsch-ZXLGP2Qh3Mo-unsplash.jpg",
    tags: ["Jeunes avocats", "Union", "Nice"],
  },
];

const Card = ({ link, background, title, tags }: CardData) => {
  return (
    <a
      href={link}
      style={{ backgroundImage: `url(${background})` }}
      className="min-h-auto relative w-full overflow-hidden rounded-[.5rem] bg-black/80 bg-cover bg-center bg-no-repeat p-5 transition-all duration-300 before:absolute before:left-0 before:top-0 before:z-10 before:block before:size-full before:bg-black/50 before:transition-all before:duration-300 before:content-[] hover:before:bg-black/30 sm:aspect-square md:aspect-auto md:min-h-[30rem] md:max-w-[30rem]"
    >
      <div className="relative z-20 flex size-full flex-col justify-between gap-20 md:gap-16">
        <div className="text-2xl font-normal leading-[1.2] text-white md:text-3xl">
          {title}
        </div>
        <div className="flex w-full flex-col gap-8">
          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag, i) => (
              <span 
                key={`${title}-tag-${i}`} 
                className="px-2 py-0.5 bg-white/20 backdrop-blur-sm text-white text-xs rounded-full border border-white/30"
              >
                {tag}
              </span>
            ))}
          </div>
          
          {/* Bouton CTA */}
          <Button 
            variant="outline" 
            size="sm" 
            className="w-fit"
          >
            Découvrez cette organisation
            <ArrowRight className="size-3.5" />
          </Button>
        </div>
      </div>
    </a>
  );
};

const OrganisationsList = ({ 
  title, 
  subtitle, 
  backgroundColor, 
  showTitle = true, 
  showSubtitle = true 
}: {
  title?: string
  subtitle?: string
  backgroundColor?: string
  showTitle?: boolean
  showSubtitle?: boolean
}) => {
  return (
    <section 
      className="py-32"
      style={{ backgroundColor: backgroundColor || 'transparent' }}
    >
      <div className="container">
        {/* Titre et sous-titre */}
        {(showTitle || showSubtitle) && (
          <div className="text-center mb-16">
            {showTitle && title && (
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                {title}
              </h2>
            )}
            {showSubtitle && subtitle && (
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}
        
        {/* Liste des organisations */}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {LIST.map((item, i) => (
            <Card key={`feature-222-${i}`} {...item} />
          ))}
        </div>
        
        {/* Bouton "Voir toutes les organisations" */}
        <div className="text-center mt-12">
          <Button 
            variant="outline" 
            size="lg"
            className="px-8 py-3"
          >
            Voir toutes les organisations
            <ArrowRight className="size-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export { OrganisationsList };