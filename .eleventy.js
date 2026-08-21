module.exports = function (eleventyConfig) {

    eleventyConfig.addPassthroughCopy("style.css");
    eleventyConfig.addPassthroughCopy("script.js");
    eleventyConfig.addPassthroughCopy("images");

    eleventyConfig.addFilter("readableDate", function (date) {

        if (!date) {
            return "";
        }

        const d = new Date(date);

        return d.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric"
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
