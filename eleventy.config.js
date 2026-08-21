module.exports = function (eleventyConfig) {

    eleventyConfig.addPassthroughCopy("style.css");
    eleventyConfig.addPassthroughCopy("script.js");
    eleventyConfig.addPassthroughCopy("images");

    return {
        dir: {
            input: ".",
            includes: "_includes",
            output: "_site"
        }
    };

};
