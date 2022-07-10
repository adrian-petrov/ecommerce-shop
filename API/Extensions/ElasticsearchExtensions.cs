using System;
using System.IO;
using System.Security.Cryptography.X509Certificates;
using Core.ElasticsearchModels;
using Elasticsearch.Net;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Nest;

namespace API.Extensions
{
    public static class ElasticsearchExtensions
    {
        public static void AddElasticsearch(this IServiceCollection services, IConfiguration config)
        {
            var user = config["Elastic:User"];
            var password = config["Elastic:Password"];
            var certificate = config["Elastic:CertificateAuthorities"];
            var host = config["Elastic:Host"];
            var port = config["Elastic:Port"];

            var pool = new SingleNodeConnectionPool(new Uri($"https://{host}:{port}"));
            var clientCertificate = new X509Certificate2(certificate);

            var settings = new ConnectionSettings(pool)
                .ServerCertificateValidationCallback(CertificateValidations.AuthorityIsRoot(clientCertificate))
                .ClientCertificate(clientCertificate)
                .BasicAuthentication(user, password)
                .EnableApiVersioningHeader()
                .ThrowExceptions()
                .PrettyJson()
                .DefaultIndex("products");

            var client = new ElasticClient(settings);

            if (!client.Indices.Exists("products").Exists)
                client.Indices.Create("products", c => c
                    .Settings(s => s
                        .Setting(UpdatableIndexSettings.MaxNGramDiff, 20)
                        .Analysis(a => a
                            .Analyzers(an => an
                                .Custom("edge_ngram_analyser", cc => cc
                                    .Tokenizer("edge_ngram_tokeniser")
                                    .Filters("lowercase"))
                                .Custom("edge_ngram_search_analyser", cc => cc
                                    .Tokenizer("whitespace")
                                    .Filters("lowercase", "stemmer", "product_synonym")))
                            .Tokenizers(tk => tk
                                .EdgeNGram("edge_ngram_tokeniser", td => td
                                    .MinGram(2)
                                    .MaxGram(15)
                                    .TokenChars(TokenChar.Letter, TokenChar.Digit, TokenChar.Custom)
                                    .CustomTokenChars("-")))
                            .TokenFilters(tf => tf
                                .Synonym("product_synonym", ps => ps
                                    .Synonyms("t sh, t shi, t shir, t shirt => t-shirt")))
                        ))  
                    .Map<ElasticSearchProduct>(m => m
                        .Properties(ps => ps
                            .Text(t => t
                                .Name(n => n.Name)
                                .Analyzer("edge_ngram_analyser")
                                .SearchAnalyzer("edge_ngram_search_analyser"))
                            .Text(t => t
                                .Name(n => n.Brand)
                                .Analyzer("edge_ngram_analyser")
                                .SearchAnalyzer("edge_ngram_search_analyser")))
                        .AutoMap()));

            services.AddSingleton<IElasticClient>(client);
        }
    }
}