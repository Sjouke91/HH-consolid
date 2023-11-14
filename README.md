## Table of contents
- [Setup](#project-setup)
- [Naming conventions](#conventions)
- [Common pitfalls](#common-pitfalls)

# DIFJ_readme

Welcome to the Direct Impact For Jobs starter kit! Here you'll find all the basic functionality to start your very new DIFJ project. But just before you do that please take the following points into consideration.

## Project setup:
```bash

$ npm i                   # install npm packages
$ cat > .env.local        # paste env vars, enter a newline and ctrl + d to save and exit
$ npm run dev             # run repo

```

If there are any changes to `package.json` or `package-lock.json` DO NOT commit them unless you know what you are doing. Run `$ git restore .` to

## Conventions

Since we are going to work in this repo with more than one developer we need conventions to keep things organised and tight!

- **Naming conventions** Let's agree to the following naming convention:

    | Type | Case | Example |
    | ----------- | ----------- | ----------- |
    | Folders | Kebab | `picture-block` |
    | Components | Pascal | `PictureBlock` |
    | Types / interfaces | Pascal | `PictureBlock` |
    | Function / Utility | Camel | `pictureBlock` |
    | Hooks | Camel | `pictureBlock` |

- Function / Utility always start with verb (get..., transform..., filter...)

- Hooks: always starts with use... (useContext, useDictionary)

- Contentful
    - Blocks are named `type + Block` (FAQBlock)
    - References to a subtype are called `type + Item` (FAQItem)

- SCSS: for classes we use BEM (block, element, modifier)
    - Blocks start with a `c-` + component name + `block` if it is a contentful block, (`c-header`, `c-paragraph-block`)
    - Elements inside the block are separated by two underscores `__`, (`c-header__outer-wrapper`)
    - Modifiers are separated with two dashes `--`

- Public assets always start with client name in `kebab-case`
```
ts-arrow-down.svg
duvak-quote-left.svg
spelt-arrow.svg
difj-close-filter.svg
```

- Component folder structure
```
components
└── picture-block                     ->    Component folder
    ├── PictureBlock.component.js     ->    Component logic
    ├── PictureBlock.query.js         ->    GraphQL fragment query
    ├── PictureBlock.schema.js        ->    Component markup
    └── PictureBlock.styles.scss      ->    Component scss styling
```

- Components should pass data to schema with a `schemaData` object
```js

// example
export default function PictureBlockComponent({ data }) {
  const pictures = data.picturesCollection.items;
  const mainImageUrl = data.mainImage.url;

  const schemaData = {
    ...data,              // helps reduce prop drilling issues
    pictures,
    mainImageUrl,
  };

  return <PictureBlockSchema data={schemaData} />; // not data={prop1, prop2}
}

```

- Components outer wrapper should be a `<section />` element
```jsx
<section className="c-columns-block__outer-wrapper outer-wrapper">
	{...}
</section>
```

- useState setter function should start with `set_prop`
```js

const [isVisisble, set_isVisible] = useState(false); // not setIsVisible

```

## Common pitfalls

- When using `buttonSelector` or `navLinkSelector`, you can pass a `key` as a prop, no need to wrap it with a fragment / div
- **Don't use index as a key!** this is the default react behaviour, you are just killing the error
- When using `useRichTextOptions` from core, the result **cannot** be wrapped with `<p>` tags, this will cause the double wrapping of paragraph elements which causes an error
- Running `npm audit`; although counter intuitive, the current javascript world is such that official package distributions will cause warnings, but we _should not_ try to fix these as they are way out of scope


## references
Generate ts types based on component json
https://www.storyblok.com/faq/how-can-i-utilize-typescript-in-my-storyblok-project

