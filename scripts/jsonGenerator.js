const config = require("../src/config/config.json");
const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");
const languages = require("../src/config/language.json");

const JSON_FOLDER = "./.json";
const CONTENT_ROOT = "src/content";
const CONTENT_DEPTH = 3;

const GROUPS = config.categories;

// get data from markdown
const getData = (folder, groupDepth, langIndex = 0) => {
  const getPaths = languages
    .map((lang, index) => {
      const langFolder = lang.contentDir ? lang.contentDir : lang.languageCode;
      const dir = path.join(CONTENT_ROOT, folder, langFolder);
      return fs
        .readdirSync(dir)
        .filter(
          (filename) =>
            !filename.startsWith("-") &&
            (filename.endsWith(".md") || filename.endsWith(".mdx")),
        )
        .flatMap((filename) => {
          const filepath = path.join(dir, filename);
          const stats = fs.statSync(filepath);
          const isFolder = stats.isDirectory();

          if (isFolder) {
            return getData(filepath, groupDepth, index);
          } else {
            const file = fs.readFileSync(filepath, "utf-8");
            const { data, content } = matter(file);
            const pathParts = filepath.split(path.sep);

            let slug;
            if (data.slug) {
              const slugParts = data.slug.split("/");
              slugParts[0] = folder;
              slug = slugParts.join("/");
            } else {
              slug = pathParts
                .slice(CONTENT_DEPTH)
                .join("/")
                .replace(/\.[^/.]+$/, "");
              slug = slug.replace(".", "");
              slug = `${folder}/${slug.split("/").slice(1).join("/")}`;
            }
            data.slug = slug;
            const group = folder;

            return {
              lang: languages[index].languageCode, // Set the correct language code dynamically
              group: group,
              slug: data.slug,
              frontmatter: data,
              content: content,
            };
          }
        });
    })
    .flat();

  const publishedPages = getPaths.filter(
    (page) => !page.frontmatter?.draft && page.frontmatter?.is_active !== false
  );
  return publishedPages;
};

try {
  // create folder if it doesn't exist
  if (!fs.existsSync(JSON_FOLDER)) {
    fs.mkdirSync(JSON_FOLDER);
  }

  let jsonData = [];
  for (const group of GROUPS) {
    jsonData = [...jsonData, ...getData(group, 3)];
  }

  // create json files
  fs.writeFileSync(`${JSON_FOLDER}/posts.json`, JSON.stringify(jsonData));
  

  // merge json files for search
  const posts = require(`../${JSON_FOLDER}/posts.json`);
  const search = [...posts];
  fs.writeFileSync(`${JSON_FOLDER}/search.json`, JSON.stringify(search));
} catch (err) {
  console.error(err);
}
