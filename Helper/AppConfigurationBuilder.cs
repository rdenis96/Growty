using Domain.Configurations;
using Microsoft.Extensions.Configuration;
using System.IO;

namespace Helper
{
    public sealed class AppConfigurationBuilder
    {
        private static volatile AppConfigurationBuilder _instance;
        private static readonly object syncRoot = new object();

        public static AppConfigurationBuilder Instance
        {
            get
            {
                if (_instance == null)
                {
                    lock (syncRoot)
                    {
                        if (_instance == null)
                        {
                            _instance = new AppConfigurationBuilder();
                        }
                    }
                }

                return _instance;
            }
        }

        public IConfigurationRoot Config { get; }

        public GeneralSettings GeneralSettings
        {
            get
            {
                var settings = new GeneralSettings();
                Config.GetSection(nameof(GeneralSettings)).Bind(settings);
                return settings;
            }
        }

        private AppConfigurationBuilder()
        {
            var envName = "Development";

            var builder = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);

            if (!string.IsNullOrEmpty(envName))
            {
                builder.AddJsonFile($"appsettings.{envName}.json", optional: true, reloadOnChange: true);
            }

            Config = builder.Build();
        }
    }
}
