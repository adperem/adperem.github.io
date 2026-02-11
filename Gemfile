# frozen_string_literal: true

source "https://rubygems.org"

gem "jekyll", "~> 4.3"
gem "jekyll-theme-chirpy"

group :jekyll_plugins do
  gem "jekyll-include-cache"
  gem "jekyll-sitemap"
  gem "jekyll-feed"
  gem "jekyll-archives"
  gem "jekyll-paginate"
  gem "jekyll-seo-tag"
end

group :test do
  gem "html-proofer", "~> 5.0"
end

platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"
end

gem "wdm", "~> 0.2.0", :platforms => [:mingw, :x64_mingw, :mswin]
