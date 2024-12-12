import NextLink, { LinkProps as NextLinkProps } from "next/link";
import { FC, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface LinkProps extends NextLinkProps {
  children: ReactNode;
  className?: string; // Optional custom styles
  noUnderline?: boolean; // Optional to toggle underline
}

const Link: FC<LinkProps> = ({
  href,
  children,
  className,
  noUnderline = false,
  ...props
}) => {
  return (
    <NextLink href={href} {...props} passHref className={twMerge("tw-no-underline tw-text-inherit", className)}>
        {children}
    </NextLink>
  );
};

export default Link;
