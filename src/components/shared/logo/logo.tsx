
import Link from "next/link"

import { siteConfig } from "@/lib/site"
import Image from "next/image"

export default function Logo() {
  return (
    <Link href="/" className="flex items-center text-xl font-black ">
      <Image
        src="/logo.png"
        alt={siteConfig.name}
        width={54}
        height={54}
        priority
        loading="eager"
        className="h-13 w-auto object-contain"
      />
      <span className=" transition-colors dark:text-white text-black">
        TaskFlow
      </span>
    </Link>
  )
}