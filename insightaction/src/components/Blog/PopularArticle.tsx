import Image from "next/image";
import Link from "next/link";

interface PopularArticleProps {
  image: string;
  title: string;
  name: string;
}

const PopularArticle = ({ image, title, name }: PopularArticleProps) => {
  return (
    <div className="flex items-center gap-4">
      <div className="h-16 w-16 overflow-hidden rounded-lg">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          width={64}
          height={64}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex-1">
        <h4>
          <Link
            href="/#"
            className="text-dark hover:text-primary dark:hover:text-primary mb-1 block text-base font-medium dark:text-white"
          >
            {title}
          </Link>
        </h4>
        <p className="text-body-color dark:text-body-color-dark text-xs">
          By {name}
        </p>
      </div>
    </div>
  );
};

export default PopularArticle;
