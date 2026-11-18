import {
  siClaude,
  siDeepseek,
  siDocker,
  siExpress,
  siFastify,
  siFirebase,
  siGit,
  siGithubactions,
  siGo,
  siGraphql,
  siJenkins,
  siJavascript,
  siKubernetes,
  siLinux,
  siMariadb,
  siMongodb,
  siMysql,
  siNestjs,
  siNextdotjs,
  siNginx,
  siNodedotjs,
  siNuxt,
  siPostgresql,
  siReact,
  siRedis,
  siSpringboot,
  siTailwindcss,
  siTypescript,
  siVite,
  siVuedotjs,
} from "simple-icons";

/**
 * 24×24 icon for a technology. Brand icons are filled paths with the brand color;
 * generic ones (no brand logo) are stroked outlines tinted by the caller.
 */
export type TechIcon = { path: string; hex?: string; stroke?: boolean };

const brand = (i: { path: string; hex: string }): TechIcon => ({ path: i.path, hex: `#${i.hex}` });

const generic = {
  database:
    "M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3zM4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3",
  arrows: "M4 8h15M15 4l4 4-4 4M20 16H5M9 12l-4 4 4 4",
  loop: "M20 11a8 8 0 0 0-14.9-3M4 3v5h5M4 13a8 8 0 0 0 14.9 3M20 21v-5h-5",
  cloud: "M7 18a4.5 4.5 0 0 1-.6-8.96A6 6 0 0 1 18 9.5a4.25 4.25 0 0 1-.5 8.5z",
  server: "M4 4h16v6H4zM4 14h16v6H4zM8 7h.01M8 17h.01",
  bucket: "M4 6c0-1.1 3.6-2 8-2s8 .9 8 2-3.6 2-8 2-8-.9-8-2zM4 6l2 13c.2 1.1 2.9 2 6 2s5.8-.9 6-2l2-13",
  globe: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c2.5 2.5 3.8 5.5 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.5-3.8-9S9.5 5.5 12 3",
  queue: "M3 7h12M3 12h12M3 17h12M18 9l3 3-3 3",
};

const stroked = (path: string): TechIcon => ({ path, stroke: true });

const icons: Record<string, TechIcon> = {
  typescript: brand(siTypescript),
  javascript: brand(siJavascript),
  react: brand(siReact),
  "react native": brand(siReact),
  claude: brand(siClaude),
  deepseek: brand(siDeepseek),
  // Simple Icons dropped the OpenAI logo (trademark); black falls back to the text color.
  chatgpt: {
    path: "M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z",
    hex: "#000000",
  },
  vite: brand(siVite),
  "next.js": brand(siNextdotjs),
  "tailwind css": brand(siTailwindcss),
  "node.js": brand(siNodedotjs),
  postgresql: brand(siPostgresql),
  git: brand(siGit),
  docker: brand(siDocker),
  graphql: brand(siGraphql),
  redis: brand(siRedis),
  go: brand(siGo),
  kubernetes: brand(siKubernetes),
  // Simple Icons dropped the Java logo (trademark), so draw its steaming cup in Java orange.
  java: {
    path: "M6 2v2M10 2v2M14 2v2M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1",
    stroke: true,
    hex: "#ED8B00",
  },
  vue: brand(siVuedotjs),
  nuxt: brand(siNuxt),
  express: brand(siExpress),
  fastify: brand(siFastify),
  nestjs: brand(siNestjs),
  mysql: brand(siMysql),
  mariadb: brand(siMariadb),
  mongodb: brand(siMongodb),
  firestore: brand(siFirebase),
  linux: brand(siLinux),
  "github actions": brand(siGithubactions),
  "spring boot": brand(siSpringboot),
  jenkins: brand(siJenkins),
  nginx: brand(siNginx),
  // AWS & Azure brand marks aren't in simple-icons, so these use generic outlines
  aws: stroked(generic.cloud),
  azure: stroked(generic.cloud),
  ec2: stroked(generic.server),
  lightsail: stroked(generic.server),
  s3: stroked(generic.bucket),
  "aws s3": stroked(generic.bucket),
  cloudfront: stroked(generic.globe),
  "azure service bus": stroked(generic.queue),
  sql: { path: generic.database, stroke: true },
  rest: { path: generic.arrows, stroke: true },
  "ci/cd": { path: generic.loop, stroke: true },
};

/** Add entries above when you add skills to `content/site.ts`. */
export function techIcon(label: string): TechIcon | undefined {
  return icons[label.trim().toLowerCase()];
}
