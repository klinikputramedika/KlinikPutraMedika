module.exports = function (eleventyConfig) {

    // File statis
    eleventyConfig.addPassthroughCopy("style.css");
    eleventyConfig.addPassthroughCopy("script.js");
    eleventyConfig.addPassthroughCopy("images");

    // Koleksi berita
    eleventyConfig.addCollection("berita", function (collectionApi) {

        return collectionApi
            .getFilteredByGlob("content/berita/*.md")
            .sort(function (a, b) {

                return new Date(b.data.date) - new Date(a.data.date);

            });

    });

    return {

        dir: {
            input: ".",
            includes: "_includes",
            output: "_site"
        }

    };

};
