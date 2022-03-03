// import { useRouter } from "next/router";
import Image from "next/image";

const Logo = ({ height }) => (
  <Image src="/img/logo.png" height={50} width={50} alt="Logo" />
);

const Shardus = ({ height = 20 }) => (
  <Image src="/img/logo.png" height={30} width={30} alt="Logo" className="mt-24"/>
);

const FEEDBACK_LINK_WITH_TRANSLATIONS = {
  "en-US": "Question? Give us feedback →",
  // "zh-CN": "有疑问？给我们反馈 →",
};

export default {
  projectLink: "https://gitlab.com/shardus",
  defaultMenuCollapsed: true,
  docsRepositoryBase: "https://gitlab.com/shardus/docs/new-docs",
  titleSuffix: " – Shardus",
  search: true,
  unstable_flexsearch: true,
  floatTOC: true,
  feedbackLink: () => {
    // const { locale } = useRouter();
    return (
      // FEEDBACK_LINK_WITH_TRANSLATIONS[locale] ||
      FEEDBACK_LINK_WITH_TRANSLATIONS["en-US"]
    );
  },
  feedbackLabels: "feedback",
  logo: () => {
    // const { locale } = useRouter();
    return (
      <>
        <Logo height={12} />
        <span
          className="mx-2 font-extrabold hidden md:inline select-none"
          title={"SHARDUS"}
        >
          Developer
        </span>
      </>
    );
  },
  head: ({ title, meta }) => {
    return (
      <>
        {/* Favicons, meta */}
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicon/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon/favicon-16x16.png"
        />
        <link rel="manifest" href="/favicon/site.webmanifest" />
        <link
          rel="mask-icon"
          href="/favicon/safari-pinned-tab.svg"
          color="#ed1b24"
        />
        <meta name="msapplication-TileColor" content="#1f1f1f" />
        <meta httpEquiv="Content-Language" content="en" />
        <meta
          name="description"
          content={
            meta.description ||
            "Shardus developer documentation for a Node.js framework that can build linearly scaleable decentralized applications."
          }
        />
        <meta
          name="og:description"
          content={
            meta.description ||
            "Shardus developer documentation for a Node.js framework that can build linearly scaleable decentralized applications."
          }
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@shardusLedger" />
        <meta name="twitter:image" content={"/img/logo.png"} />
        <meta
          name="og:title"
          content={
            title
              ? title + " – Shardus Documentation"
              : "Shardus Developer Docs: A Node.js Framework for Linear scaleable Decentralized Applications"
          }
        />
        <meta name="og:image" content={"/img/logo.png"} />
        <meta name="apple-mobile-web-app-title" content="Shardus Dev Docs" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/docsearch.js@2/dist/cdn/docsearch.min.css"
          media="print"
          onLoad="this.media='all'"
        />
      </>
    );
  },
  footerEditLink: () => {
    return "Edit this page on GitLab →";
  },
  footerText: () => {
    return (
      <a
        href="https://gitlab.com/shardus"
        target="_blank"
        rel="noopener"
        className="inline-flex items-center no-underline text-current font-semibold"
      >
        <span className="mr-1 mb-2">Created by the team at Shardus</span>
        <span>
          <Shardus />
        </span>
      </a>
    );
  },
};
