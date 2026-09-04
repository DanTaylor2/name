/* =====================================================================
 *  NAMING CONFIGURATION
 *  ---------------------------------------------------------------------
 *  All naming rules live here. Change these values to update the site's
 *  behaviour without touching app.js. The Azure resource abbreviation
 *  list is sourced from:
 *  https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/azure-best-practices/resource-abbreviations
 * ===================================================================== */

const NAMING_CONFIG = {
  // 10.1 Base format. Tokens wrapped in {} are replaced with component
  // values. Reorder tokens here to change the generated name format.
  format: "{resourceType}-{env}-{appName}-{region}{instance}",

  // Format used for resources that must fit a tight character limit
  // (see 10.5). The env token is shortened to a single letter.
  condensedFormat: "{resourceType}-{env}-{appName}-{region}{instance}",

  // 10.5 Resources that are subject to a strict character limit and
  // therefore use the condensed format. Add the resource abbreviation
  // here to opt a resource into condensed naming.
  condensedResources: ["vm", "vmss"],

  // Hard character limit applied to the final name for condensed
  // resources (Windows VM 15-character limit).
  condensedCharLimit: 15,

  // 10.2 Components - descriptive metadata only (shown in the UI).
  components: [
    { name: "Resource Type", description: "Azure resource abbreviation", examples: "vm, rg, kv" },
    { name: "Environment",   description: "Deployment environment",       examples: "prod, dev, test, qa" },
    { name: "App Name",      description: "Application identifier",      examples: "web, api, auth" },
    { name: "Region",        description: "Either UK South or UK West",   examples: "uks, ukw" },
    { name: "Instance",      description: "Optional numeric identifier", examples: "01, 02" },
  ],

  // Environments. `short` is used in the normal format, `condensed` in
  // the condensed format (10.5: dev=d, test=t, prod=p).
  environments: [
    { value: "prod", short: "prod", condensed: "p" },
    { value: "dev",  short: "dev",  condensed: "d" },
    { value: "test", short: "test", condensed: "t" },
    { value: "qa",   short: "qa",   condensed: "q" },
  ],

  // Regions.
  regions: [
    { value: "uks", label: "UK South" },
    { value: "ukw", label: "UK West" },
  ],

  // 10.4 Resources that are always unique and therefore do NOT need an
  // instance number (e.g. a resource group). Add abbreviations here.
  uniqueResources: ["rg"],

  // 10.3 General naming rules (displayed in the UI as a checklist).
  generalRules: [
    "Case: All resource names must be lowercase.",
    "Separator: Use a dash (-) to separate components where available.",
    "Short and Descriptive: Names should be compact but meaningful.",
    "Prefix Standardization: Use Microsoft's recommended abbreviations for resource types.",
    "On resources that do not allow special characters, omit the dashes.",
  ],

  // 10.4 Instance-number rule (displayed in the UI).
  instanceRule: "An instance number should be added when multiple instances of the same resource type are possible (e.g. virtual machines). It is not required for resources that will only ever be unique (e.g. a resource group).",

  // -------------------------------------------------------------------
  //  Azure resource abbreviations
  //  Each entry: { name, namespace, abbr, category, multiInstance }
  //    multiInstance: true  -> instance number is allowed/encouraged
  //                   false -> instance number is hidden (unique resource)
  //  Edit this list freely to add, remove, or correct abbreviations.
  // -------------------------------------------------------------------
  resources: [
    // AI + machine learning
    { name: "AI Search", abbr: "srch", namespace: "Microsoft.Search/searchServices", category: "AI + machine learning", multiInstance: true },
    { name: "Foundry Tools (multi-service account)", abbr: "ais", namespace: "Microsoft.CognitiveServices/accounts", category: "AI + machine learning", multiInstance: true },
    { name: "Foundry account", abbr: "aif", namespace: "Microsoft.CognitiveServices/accounts", category: "AI + machine learning", multiInstance: true },
    { name: "Foundry account project", abbr: "proj", namespace: "Microsoft.CognitiveServices/accounts/projects", category: "AI + machine learning", multiInstance: true },
    { name: "Foundry hub", abbr: "hub", namespace: "Microsoft.MachineLearningServices/workspaces", category: "AI + machine learning", multiInstance: true },
    { name: "Foundry hub project", abbr: "proj", namespace: "Microsoft.MachineLearningServices/workspaces", category: "AI + machine learning", multiInstance: true },
    { name: "Azure AI Video Indexer", abbr: "avi", namespace: "Microsoft.VideoIndexer/accounts", category: "AI + machine learning", multiInstance: true },
    { name: "Azure Machine Learning workspace", abbr: "mlw", namespace: "Microsoft.MachineLearningServices/workspaces", category: "AI + machine learning", multiInstance: true },
    { name: "Azure OpenAI service", abbr: "oai", namespace: "Microsoft.CognitiveServices/accounts", category: "AI + machine learning", multiInstance: true },
    { name: "Bot service", abbr: "bot", namespace: "Microsoft.BotService/botServices", category: "AI + machine learning", multiInstance: true },
    { name: "Computer vision", abbr: "cv", namespace: "Microsoft.CognitiveServices/accounts", category: "AI + machine learning", multiInstance: true },
    { name: "Content moderator", abbr: "cm", namespace: "Microsoft.CognitiveServices/accounts", category: "AI + machine learning", multiInstance: true },
    { name: "Content safety", abbr: "cs", namespace: "Microsoft.CognitiveServices/accounts", category: "AI + machine learning", multiInstance: true },
    { name: "Custom vision (prediction)", abbr: "cstv", namespace: "Microsoft.CognitiveServices/accounts", category: "AI + machine learning", multiInstance: true },
    { name: "Custom vision (training)", abbr: "cstvt", namespace: "Microsoft.CognitiveServices/accounts", category: "AI + machine learning", multiInstance: true },
    { name: "Document intelligence", abbr: "di", namespace: "Microsoft.CognitiveServices/accounts", category: "AI + machine learning", multiInstance: true },
    { name: "Face API", abbr: "face", namespace: "Microsoft.CognitiveServices/accounts", category: "AI + machine learning", multiInstance: true },
    { name: "Health Insights", abbr: "hi", namespace: "Microsoft.CognitiveServices/accounts", category: "AI + machine learning", multiInstance: true },
    { name: "Immersive reader", abbr: "ir", namespace: "Microsoft.CognitiveServices/accounts", category: "AI + machine learning", multiInstance: true },
    { name: "Language service", abbr: "lang", namespace: "Microsoft.CognitiveServices/accounts", category: "AI + machine learning", multiInstance: true },
    { name: "Speech service", abbr: "spch", namespace: "Microsoft.CognitiveServices/accounts", category: "AI + machine learning", multiInstance: true },
    { name: "Translator", abbr: "trsl", namespace: "Microsoft.CognitiveServices/accounts", category: "AI + machine learning", multiInstance: true },

    // Analytics and IoT
    { name: "Azure Analysis Services server", abbr: "as", namespace: "Microsoft.AnalysisServices/servers", category: "Analytics and IoT", multiInstance: true },
    { name: "Azure Databricks Access Connector", abbr: "dbac", namespace: "Microsoft.Databricks/workspaces/accessConnectors", category: "Analytics and IoT", multiInstance: true },
    { name: "Azure Databricks workspace", abbr: "dbw", namespace: "Microsoft.Databricks/workspaces", category: "Analytics and IoT", multiInstance: true },
    { name: "Azure Data Explorer cluster", abbr: "dec", namespace: "Microsoft.Kusto/clusters", category: "Analytics and IoT", multiInstance: true },
    { name: "Azure Data Explorer cluster database", abbr: "dedb", namespace: "Microsoft.Kusto/clusters/databases", category: "Analytics and IoT", multiInstance: true },
    { name: "Azure Data Factory", abbr: "adf", namespace: "Microsoft.DataFactory/factories", category: "Analytics and IoT", multiInstance: true },
    { name: "Azure Digital Twin instance", abbr: "dt", namespace: "Microsoft.DigitalTwins/digitalTwinsInstances", category: "Analytics and IoT", multiInstance: true },
    { name: "Azure Stream Analytics", abbr: "asa", namespace: "Microsoft.StreamAnalytics/cluster", category: "Analytics and IoT", multiInstance: true },
    { name: "Azure Synapse Analytics private link hub", abbr: "synplh", namespace: "Microsoft.Synapse/privateLinkHubs", category: "Analytics and IoT", multiInstance: true },
    { name: "Azure Synapse Analytics SQL Dedicated Pool", abbr: "syndp", namespace: "Microsoft.Synapse/workspaces/sqlPools", category: "Analytics and IoT", multiInstance: true },
    { name: "Azure Synapse Analytics Spark Pool", abbr: "synsp", namespace: "Microsoft.Synapse/workspaces/bigDataPools", category: "Analytics and IoT", multiInstance: true },
    { name: "Azure Synapse Analytics workspaces", abbr: "synw", namespace: "Microsoft.Synapse/workspaces", category: "Analytics and IoT", multiInstance: true },
    { name: "Data Lake Store account", abbr: "dls", namespace: "Microsoft.DataLakeStore/accounts", category: "Analytics and IoT", multiInstance: true },
    { name: "Event Hubs namespace", abbr: "evhns", namespace: "Microsoft.EventHub/namespaces", category: "Analytics and IoT", multiInstance: true },
    { name: "Event hub", abbr: "evh", namespace: "Microsoft.EventHub/namespaces/eventHubs", category: "Analytics and IoT", multiInstance: true },
    { name: "Event Grid domain", abbr: "evgd", namespace: "Microsoft.EventGrid/domains", category: "Analytics and IoT", multiInstance: true },
    { name: "Event Grid namespace", abbr: "evgns", namespace: "Microsoft.EventGrid/namespaces", category: "Analytics and IoT", multiInstance: true },
    { name: "Event Grid subscriptions", abbr: "evgs", namespace: "Microsoft.EventGrid/eventSubscriptions", category: "Analytics and IoT", multiInstance: true },
    { name: "Event Grid topic", abbr: "evgt", namespace: "Microsoft.EventGrid/domains/topics", category: "Analytics and IoT", multiInstance: true },
    { name: "Event Grid system topic", abbr: "egst", namespace: "Microsoft.EventGrid/systemTopics", category: "Analytics and IoT", multiInstance: true },
    { name: "Fabric Capacity", abbr: "fc", namespace: "Microsoft.Fabric/capacities", category: "Analytics and IoT", multiInstance: true },
    { name: "HDInsight - Hadoop cluster", abbr: "hadoop", namespace: "Microsoft.HDInsight/clusters", category: "Analytics and IoT", multiInstance: true },
    { name: "HDInsight - HBase cluster", abbr: "hbase", namespace: "Microsoft.HDInsight/clusters", category: "Analytics and IoT", multiInstance: true },
    { name: "HDInsight - Kafka cluster", abbr: "kafka", namespace: "Microsoft.HDInsight/clusters", category: "Analytics and IoT", multiInstance: true },
    { name: "HDInsight - Spark cluster", abbr: "spark", namespace: "Microsoft.HDInsight/clusters", category: "Analytics and IoT", multiInstance: true },
    { name: "HDInsight - Storm cluster", abbr: "storm", namespace: "Microsoft.HDInsight/clusters", category: "Analytics and IoT", multiInstance: true },
    { name: "HDInsight - ML Services cluster", abbr: "mls", namespace: "Microsoft.HDInsight/clusters", category: "Analytics and IoT", multiInstance: true },
    { name: "IoT hub", abbr: "iot", namespace: "Microsoft.Devices/IotHubs", category: "Analytics and IoT", multiInstance: true },
    { name: "Provisioning services", abbr: "provs", namespace: "Microsoft.Devices/provisioningServices", category: "Analytics and IoT", multiInstance: true },
    { name: "Provisioning services certificate", abbr: "pcert", namespace: "Microsoft.Devices/provisioningServices/certificates", category: "Analytics and IoT", multiInstance: true },
    { name: "Power BI Embedded", abbr: "pbi", namespace: "Microsoft.PowerBIDedicated/capacities", category: "Analytics and IoT", multiInstance: true },
    { name: "Time Series Insights environment", abbr: "tsi", namespace: "Microsoft.TimeSeriesInsights/environments", category: "Analytics and IoT", multiInstance: true },

    // Compute and web
    { name: "App Service environment", abbr: "ase", namespace: "Microsoft.Web/hostingEnvironments", category: "Compute and web", multiInstance: true },
    { name: "App Service plan", abbr: "asp", namespace: "Microsoft.Web/serverFarms", category: "Compute and web", multiInstance: true },
    { name: "Azure Load Testing instance", abbr: "lt", namespace: "Microsoft.LoadTestService/loadTests", category: "Compute and web", multiInstance: true },
    { name: "Availability set", abbr: "avail", namespace: "Microsoft.Compute/availabilitySets", category: "Compute and web", multiInstance: true },
    { name: "Azure Arc enabled server", abbr: "arcs", namespace: "Microsoft.HybridCompute/machines", category: "Compute and web", multiInstance: true },
    { name: "Azure Arc enabled kubernetes cluster", abbr: "arck", namespace: "Microsoft.Kubernetes/connectedClusters", category: "Compute and web", multiInstance: true },
    { name: "Azure Arc private link scope", abbr: "pls", namespace: "Microsoft.HybridCompute/privateLinkScopes", category: "Compute and web", multiInstance: true },
    { name: "Azure Arc gateway", abbr: "arcgw", namespace: "Microsoft.HybridCompute/gateways", category: "Compute and web", multiInstance: true },
    { name: "Batch accounts", abbr: "ba", namespace: "Microsoft.Batch/batchAccounts", category: "Compute and web", multiInstance: true },
    { name: "Cloud service", abbr: "cld", namespace: "Microsoft.Compute/cloudServices", category: "Compute and web", multiInstance: true },
    { name: "Communication Services", abbr: "acs", namespace: "Microsoft.Communication/communicationServices", category: "Compute and web", multiInstance: true },
    { name: "Disk encryption set", abbr: "des", namespace: "Microsoft.Compute/diskEncryptionSets", category: "Compute and web", multiInstance: true },
    { name: "Function app", abbr: "func", namespace: "Microsoft.Web/sites", category: "Compute and web", multiInstance: true },
    { name: "Gallery", abbr: "gal", namespace: "Microsoft.Compute/galleries", category: "Compute and web", multiInstance: true },
    { name: "Hosting environment", abbr: "host", namespace: "Microsoft.Web/hostingEnvironments", category: "Compute and web", multiInstance: true },
    { name: "Image template", abbr: "it", namespace: "Microsoft.VirtualMachineImages/imageTemplates", category: "Compute and web", multiInstance: true },
    { name: "Managed disk (OS)", abbr: "osdisk", namespace: "Microsoft.Compute/disks", category: "Compute and web", multiInstance: true },
    { name: "Managed disk (data)", abbr: "disk", namespace: "Microsoft.Compute/disks", category: "Compute and web", multiInstance: true },
    { name: "Notification Hubs", abbr: "ntf", namespace: "Microsoft.NotificationHubs/namespaces/notificationHubs", category: "Compute and web", multiInstance: true },
    { name: "Notification Hubs namespace", abbr: "ntfns", namespace: "Microsoft.NotificationHubs/namespaces", category: "Compute and web", multiInstance: true },
    { name: "Proximity placement group", abbr: "ppg", namespace: "Microsoft.Compute/proximityPlacementGroups", category: "Compute and web", multiInstance: true },
    { name: "Restore point collection", abbr: "rpc", namespace: "Microsoft.Compute/restorePointCollections", category: "Compute and web", multiInstance: true },
    { name: "Snapshot", abbr: "snap", namespace: "Microsoft.Compute/snapshots", category: "Compute and web", multiInstance: true },
    { name: "Static web app", abbr: "stapp", namespace: "Microsoft.Web/staticSites", category: "Compute and web", multiInstance: true },
    { name: "Virtual machine", abbr: "vm", namespace: "Microsoft.Compute/virtualMachines", category: "Compute and web", multiInstance: true },
    { name: "Virtual machine scale set", abbr: "vmss", namespace: "Microsoft.Compute/virtualMachineScaleSets", category: "Compute and web", multiInstance: true },
    { name: "Virtual machine maintenance configuration", abbr: "mc", namespace: "Microsoft.Maintenance/maintenanceConfigurations", category: "Compute and web", multiInstance: true },
    { name: "VM storage account", abbr: "stvm", namespace: "Microsoft.Storage/storageAccounts", category: "Compute and web", multiInstance: true },
    { name: "Web app", abbr: "app", namespace: "Microsoft.Web/sites", category: "Compute and web", multiInstance: true },

    // Containers
    { name: "AKS cluster", abbr: "aks", namespace: "Microsoft.ContainerService/managedClusters", category: "Containers", multiInstance: true },
    { name: "AKS system node pool", abbr: "npsystem", namespace: "Microsoft.ContainerService/managedClusters/agentPools", category: "Containers", multiInstance: true },
    { name: "AKS user node pool", abbr: "np", namespace: "Microsoft.ContainerService/managedClusters/agentPools", category: "Containers", multiInstance: true },
    { name: "AKS Fleet manager", abbr: "fleet", namespace: "Microsoft.ContainerService/fleets", category: "Containers", multiInstance: true },
    { name: "Container apps", abbr: "ca", namespace: "Microsoft.App/containerApps", category: "Containers", multiInstance: true },
    { name: "Container apps environment", abbr: "cae", namespace: "Microsoft.App/managedEnvironments", category: "Containers", multiInstance: true },
    { name: "Container apps job", abbr: "caj", namespace: "Microsoft.App/jobs", category: "Containers", multiInstance: true },
    { name: "Container registry", abbr: "cr", namespace: "Microsoft.ContainerRegistry/registries", category: "Containers", multiInstance: true },
    { name: "Container instance", abbr: "ci", namespace: "Microsoft.ContainerInstance/containerGroups", category: "Containers", multiInstance: true },
    { name: "Service Fabric cluster", abbr: "sf", namespace: "Microsoft.ServiceFabric/clusters", category: "Containers", multiInstance: true },
    { name: "Service Fabric managed cluster", abbr: "sfmc", namespace: "Microsoft.ServiceFabric/managedClusters", category: "Containers", multiInstance: true },

    // Databases
    { name: "Azure Cosmos DB database", abbr: "cosmos", namespace: "Microsoft.DocumentDB/databaseAccounts/sqlDatabases", category: "Databases", multiInstance: true },
    { name: "Azure Cosmos DB for Apache Cassandra account", abbr: "coscas", namespace: "Microsoft.DocumentDB/databaseAccounts", category: "Databases", multiInstance: true },
    { name: "Azure Cosmos DB for MongoDB account", abbr: "cosmon", namespace: "Microsoft.DocumentDB/databaseAccounts", category: "Databases", multiInstance: true },
    { name: "Azure Cosmos DB for NoSQL account", abbr: "cosno", namespace: "Microsoft.DocumentDb/databaseAccounts", category: "Databases", multiInstance: true },
    { name: "Azure Cosmos DB for Table account", abbr: "costab", namespace: "Microsoft.DocumentDb/databaseAccounts", category: "Databases", multiInstance: true },
    { name: "Azure Cosmos DB for Apache Gremlin account", abbr: "cosgrm", namespace: "Microsoft.DocumentDb/databaseAccounts", category: "Databases", multiInstance: true },
    { name: "Azure Cosmos DB PostgreSQL cluster", abbr: "cospos", namespace: "Microsoft.DBforPostgreSQL/serverGroupsv2", category: "Databases", multiInstance: true },
    { name: "Azure Managed Redis", abbr: "amr", namespace: "Microsoft.Cache/RedisEnterprise", category: "Databases", multiInstance: true },
    { name: "Azure SQL Database server", abbr: "sql", namespace: "Microsoft.Sql/servers", category: "Databases", multiInstance: true },
    { name: "Azure SQL database", abbr: "sqldb", namespace: "Microsoft.Sql/servers/databases", category: "Databases", multiInstance: true },
    { name: "Azure SQL Elastic Job agent", abbr: "sqlja", namespace: "Microsoft.Sql/servers/jobAgents", category: "Databases", multiInstance: true },
    { name: "Azure SQL Elastic Pool", abbr: "sqlep", namespace: "Microsoft.Sql/servers/elasticpool", category: "Databases", multiInstance: true },
    { name: "MySQL database", abbr: "mysql", namespace: "Microsoft.DBforMySQL/servers", category: "Databases", multiInstance: true },
    { name: "PostgreSQL flexible server", abbr: "pgsql", namespace: "Microsoft.DBforPostgreSQL/flexibleServers", category: "Databases", multiInstance: true },
    { name: "SQL Managed Instance", abbr: "sqlmi", namespace: "Microsoft.Sql/managedInstances", category: "Databases", multiInstance: true },

    // Developer tools
    { name: "App Configuration store", abbr: "appcs", namespace: "Microsoft.AppConfiguration/configurationStores", category: "Developer tools", multiInstance: true },
    { name: "Maps account", abbr: "map", namespace: "Microsoft.Maps/accounts", category: "Developer tools", multiInstance: true },
    { name: "SignalR", abbr: "sigr", namespace: "Microsoft.SignalRService/SignalR", category: "Developer tools", multiInstance: true },
    { name: "WebPubSub", abbr: "wps", namespace: "Microsoft.SignalRService/webPubSub", category: "Developer tools", multiInstance: true },

    // DevOps
    { name: "Azure Managed Grafana", abbr: "amg", namespace: "Microsoft.Dashboard/grafana", category: "DevOps", multiInstance: true },
    { name: "Managed DevOps Pools", abbr: "mdp", namespace: "Microsoft.DevOpsInfrastructure/pools", category: "DevOps", multiInstance: true },

    // Integration
    { name: "API management service instance", abbr: "apim", namespace: "Microsoft.ApiManagement/service", category: "Integration", multiInstance: true },
    { name: "Integration account", abbr: "ia", namespace: "Microsoft.Logic/integrationAccounts", category: "Integration", multiInstance: true },
    { name: "Logic app", abbr: "logic", namespace: "Microsoft.Logic/workflows", category: "Integration", multiInstance: true },
    { name: "Service Bus namespace", abbr: "sbns", namespace: "Microsoft.ServiceBus/namespaces", category: "Integration", multiInstance: true },
    { name: "Service Bus queue", abbr: "sbq", namespace: "Microsoft.ServiceBus/namespaces/queues", category: "Integration", multiInstance: true },
    { name: "Service Bus topic", abbr: "sbt", namespace: "Microsoft.ServiceBus/namespaces/topics", category: "Integration", multiInstance: true },
    { name: "Service Bus topic subscription", abbr: "sbts", namespace: "Microsoft.ServiceBus/namespaces/topics/subscriptions", category: "Integration", multiInstance: true },

    // Management and governance
    { name: "Automation account", abbr: "aa", namespace: "Microsoft.Automation/automationAccounts", category: "Management and governance", multiInstance: true },
    { name: "Application Insights", abbr: "appi", namespace: "Microsoft.Insights/components", category: "Management and governance", multiInstance: true },
    { name: "Azure Monitor action group", abbr: "ag", namespace: "Microsoft.Insights/actionGroups", category: "Management and governance", multiInstance: true },
    { name: "Azure Monitor data collection rule", abbr: "dcr", namespace: "Microsoft.Insights/dataCollectionRules", category: "Management and governance", multiInstance: true },
    { name: "Azure Monitor alert processing rule", abbr: "apr", namespace: "Microsoft.AlertsManagement/actionRules", category: "Management and governance", multiInstance: true },
    { name: "Data collection endpoint", abbr: "dce", namespace: "Microsoft.Insights/dataCollectionEndpoints", category: "Management and governance", multiInstance: true },
    { name: "Deployment scripts", abbr: "script", namespace: "Microsoft.Resources/deploymentScripts", category: "Management and governance", multiInstance: true },
    { name: "Log Analytics workspace", abbr: "log", namespace: "Microsoft.OperationalInsights/workspaces", category: "Management and governance", multiInstance: true },
    { name: "Log Analytics query packs", abbr: "pack", namespace: "Microsoft.OperationalInsights/querypacks", category: "Management and governance", multiInstance: true },
    { name: "Management group", abbr: "mg", namespace: "Microsoft.Management/managementGroups", category: "Management and governance", multiInstance: false },
    { name: "Microsoft Purview instance", abbr: "pview", namespace: "Microsoft.Purview/accounts", category: "Management and governance", multiInstance: true },
    { name: "Resource group", abbr: "rg", namespace: "Microsoft.Resources/resourceGroups", category: "Management and governance", multiInstance: false },
    { name: "Template specs name", abbr: "ts", namespace: "Microsoft.Resources/templateSpecs", category: "Management and governance", multiInstance: true },

    // Migration
    { name: "Azure Migrate project", abbr: "migr", namespace: "Microsoft.Migrate/assessmentProjects", category: "Migration", multiInstance: true },
    { name: "Database Migration Service instance", abbr: "dms", namespace: "Microsoft.DataMigration/services", category: "Migration", multiInstance: true },
    { name: "Recovery Services vault", abbr: "rsv", namespace: "Microsoft.RecoveryServices/vaults", category: "Migration", multiInstance: true },

    // Networking
    { name: "Application gateway", abbr: "agw", namespace: "Microsoft.Network/applicationGateways", category: "Networking", multiInstance: true },
    { name: "Application security group (ASG)", abbr: "asg", namespace: "Microsoft.Network/applicationSecurityGroups", category: "Networking", multiInstance: true },
    { name: "CDN profile", abbr: "cdnp", namespace: "Microsoft.Cdn/profiles", category: "Networking", multiInstance: true },
    { name: "CDN endpoint", abbr: "cdne", namespace: "Microsoft.Cdn/profiles/endpoints", category: "Networking", multiInstance: true },
    { name: "Connections", abbr: "con", namespace: "Microsoft.Network/connections", category: "Networking", multiInstance: true },
    { name: "DNS forwarding ruleset", abbr: "dnsfrs", namespace: "Microsoft.Network/dnsForwardingRulesets", category: "Networking", multiInstance: true },
    { name: "DNS private resolver", abbr: "dnspr", namespace: "Microsoft.Network/dnsResolvers", category: "Networking", multiInstance: true },
    { name: "DNS private resolver inbound endpoint", abbr: "in", namespace: "Microsoft.Network/dnsResolvers/inboundEndpoints", category: "Networking", multiInstance: true },
    { name: "DNS private resolver outbound endpoint", abbr: "out", namespace: "Microsoft.Network/dnsResolvers/outboundEndpoints", category: "Networking", multiInstance: true },
    { name: "Firewall", abbr: "afw", namespace: "Microsoft.Network/azureFirewalls", category: "Networking", multiInstance: true },
    { name: "Firewall policy", abbr: "afwp", namespace: "Microsoft.Network/firewallPolicies", category: "Networking", multiInstance: true },
    { name: "ExpressRoute circuit", abbr: "erc", namespace: "Microsoft.Network/expressRouteCircuits", category: "Networking", multiInstance: true },
    { name: "ExpressRoute direct", abbr: "erd", namespace: "Microsoft.Network/expressRoutePorts", category: "Networking", multiInstance: true },
    { name: "ExpressRoute gateway", abbr: "ergw", namespace: "Microsoft.Network/virtualNetworkGateways", category: "Networking", multiInstance: true },
    { name: "Front Door (Standard/Premium) profile", abbr: "afd", namespace: "Microsoft.Cdn/profiles", category: "Networking", multiInstance: true },
    { name: "Front Door (Standard/Premium) endpoint", abbr: "fde", namespace: "Microsoft.Cdn/profiles/afdEndpoints", category: "Networking", multiInstance: true },
    { name: "Front Door firewall policy", abbr: "fdfp", namespace: "Microsoft.Network/frontdoorWebApplicationFirewallPolicies", category: "Networking", multiInstance: true },
    { name: "IP group", abbr: "ipg", namespace: "Microsoft.Network/ipGroups", category: "Networking", multiInstance: true },
    { name: "Load balancer (internal)", abbr: "lbi", namespace: "Microsoft.Network/loadBalancers", category: "Networking", multiInstance: true },
    { name: "Load balancer (external)", abbr: "lbe", namespace: "Microsoft.Network/loadBalancers", category: "Networking", multiInstance: true },
    { name: "Load balancer rule", abbr: "rule", namespace: "Microsoft.Network/loadBalancers/inboundNatRules", category: "Networking", multiInstance: true },
    { name: "Local network gateway", abbr: "lgw", namespace: "Microsoft.Network/localNetworkGateways", category: "Networking", multiInstance: true },
    { name: "NAT gateway", abbr: "ng", namespace: "Microsoft.Network/natGateways", category: "Networking", multiInstance: true },
    { name: "Network interface (NIC)", abbr: "nic", namespace: "Microsoft.Network/networkInterfaces", category: "Networking", multiInstance: true },
    { name: "Network security perimeter", abbr: "nsp", namespace: "Microsoft.Network/networkSecurityPerimeters", category: "Networking", multiInstance: true },
    { name: "Network security group (NSG)", abbr: "nsg", namespace: "Microsoft.Network/networkSecurityGroups", category: "Networking", multiInstance: true },
    { name: "Network security group (NSG) security rules", abbr: "nsgsr", namespace: "Microsoft.Network/networkSecurityGroups/securityRules", category: "Networking", multiInstance: true },
    { name: "Network Watcher", abbr: "nw", namespace: "Microsoft.Network/networkWatchers", category: "Networking", multiInstance: true },
    { name: "Private Link", abbr: "pl", namespace: "Microsoft.Network/privateLinkServices", category: "Networking", multiInstance: true },
    { name: "Private endpoint", abbr: "pep", namespace: "Microsoft.Network/privateEndpoints", category: "Networking", multiInstance: true },
    { name: "Public IP address", abbr: "pip", namespace: "Microsoft.Network/publicIPAddresses", category: "Networking", multiInstance: true },
    { name: "Public IP address prefix", abbr: "ippre", namespace: "Microsoft.Network/publicIPPrefixes", category: "Networking", multiInstance: true },
    { name: "Route filter", abbr: "rf", namespace: "Microsoft.Network/routeFilters", category: "Networking", multiInstance: true },
    { name: "Route server", abbr: "rtserv", namespace: "Microsoft.Network/virtualHubs", category: "Networking", multiInstance: true },
    { name: "Route table", abbr: "rt", namespace: "Microsoft.Network/routeTables", category: "Networking", multiInstance: true },
    { name: "Service endpoint policy", abbr: "se", namespace: "Microsoft.Network/serviceEndPointPolicies", category: "Networking", multiInstance: true },
    { name: "Traffic Manager profile", abbr: "traf", namespace: "Microsoft.Network/trafficManagerProfiles", category: "Networking", multiInstance: true },
    { name: "User defined route (UDR)", abbr: "udr", namespace: "Microsoft.Network/routeTables/routes", category: "Networking", multiInstance: true },
    { name: "Virtual network", abbr: "vnet", namespace: "Microsoft.Network/virtualNetworks", category: "Networking", multiInstance: true },
    { name: "Virtual network gateway", abbr: "vgw", namespace: "Microsoft.Network/virtualNetworkGateways", category: "Networking", multiInstance: true },
    { name: "Virtual network manager", abbr: "vnm", namespace: "Microsoft.Network/networkManagers", category: "Networking", multiInstance: true },
    { name: "Virtual network peering", abbr: "peer", namespace: "Microsoft.Network/virtualNetworks/virtualNetworkPeerings", category: "Networking", multiInstance: true },
    { name: "Virtual network subnet", abbr: "snet", namespace: "Microsoft.Network/virtualNetworks/subnets", category: "Networking", multiInstance: true },
    { name: "Virtual WAN", abbr: "vwan", namespace: "Microsoft.Network/virtualWans", category: "Networking", multiInstance: true },
    { name: "Virtual WAN Hub", abbr: "vhub", namespace: "Microsoft.Network/virtualHubs", category: "Networking", multiInstance: true },

    // Security
    { name: "Azure Bastion", abbr: "bas", namespace: "Microsoft.Network/bastionHosts", category: "Security", multiInstance: true },
    { name: "Key vault", abbr: "kv", namespace: "Microsoft.KeyVault/vaults", category: "Security", multiInstance: true },
    { name: "Key Vault Managed HSM", abbr: "kvmhsm", namespace: "Microsoft.KeyVault/managedHSMs", category: "Security", multiInstance: true },
    { name: "Managed identity", abbr: "id", namespace: "Microsoft.ManagedIdentity/userAssignedIdentities", category: "Security", multiInstance: true },
    { name: "SSH key", abbr: "sshkey", namespace: "Microsoft.Compute/sshPublicKeys", category: "Security", multiInstance: true },
    { name: "VPN Gateway", abbr: "vpng", namespace: "Microsoft.Network/vpnGateways", category: "Security", multiInstance: true },
    { name: "VPN connection", abbr: "vcn", namespace: "Microsoft.Network/vpnGateways/vpnConnections", category: "Security", multiInstance: true },
    { name: "VPN site", abbr: "vst", namespace: "Microsoft.Network/vpnGateways/vpnSites", category: "Security", multiInstance: true },
    { name: "Web Application Firewall (WAF) policy", abbr: "waf", namespace: "Microsoft.Network/firewallPolicies", category: "Security", multiInstance: true },
    { name: "Web Application Firewall (WAF) policy rule group", abbr: "wafrg", namespace: "Microsoft.Network/firewallPolicies/ruleGroups", category: "Security", multiInstance: true },

    // Storage
    { name: "Azure Backup Resource Guard", abbr: "rgd", namespace: "Microsoft.DataProtection/resourceGuards", category: "Storage", multiInstance: true },
    { name: "Backup Vault name", abbr: "bvault", namespace: "Microsoft.DataProtection/backupVaults", category: "Storage", multiInstance: true },
    { name: "Backup Vault policy", abbr: "bkpol", namespace: "Microsoft.DataProtection/backupVaults/backupPolicies", category: "Storage", multiInstance: true },
    { name: "File share", abbr: "share", namespace: "Microsoft.Storage/storageAccounts/fileServices/shares", category: "Storage", multiInstance: true },
    { name: "Storage account", abbr: "st", namespace: "Microsoft.Storage/storageAccounts", category: "Storage", multiInstance: true },
    { name: "Storage Sync Service name", abbr: "sss", namespace: "Microsoft.StorageSync/storageSyncServices", category: "Storage", multiInstance: true },

    // Virtual desktop infrastructure
    { name: "Virtual desktop host pool", abbr: "vdpool", namespace: "Microsoft.DesktopVirtualization/hostPools", category: "Virtual desktop infrastructure", multiInstance: true },
    { name: "Virtual desktop application group", abbr: "vdag", namespace: "Microsoft.DesktopVirtualization/applicationGroups", category: "Virtual desktop infrastructure", multiInstance: true },
    { name: "Virtual desktop workspace", abbr: "vdws", namespace: "Microsoft.DesktopVirtualization/workspaces", category: "Virtual desktop infrastructure", multiInstance: true },
    { name: "Virtual desktop scaling plan", abbr: "vdscaling", namespace: "Microsoft.DesktopVirtualization/scalingPlans", category: "Virtual desktop infrastructure", multiInstance: true },
  ],
};

// Expose globally for app.js
window.NAMING_CONFIG = NAMING_CONFIG;
