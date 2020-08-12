namespace Domain.Configurations
{
    public class GeneralSettings
    {
        public string Environment { get; set; }

        public bool EnableDetailedErrors { get; set; }

        public string JwtSecretKey { get; set; }
    }
}
