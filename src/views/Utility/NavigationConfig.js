// src/views/Utility/NavigationConfig.js

export const navigationConfig = {
  mainNav: [
    {
      id: "cashier",
      title: "Cashier",
      icon: "fa-cash-register",
      route: "/cashier",
      permission: "Navigation_Cashier",
      isLink: true,
    },
        {
      id: "mrf",
      title: "MRF",
      icon: "fa-clipboard-list",
      permission: "Navigation_MRF",
      isDropdown: true,
      groupBy: true,
      items: [
        {
          id: "request-ingredient",
          title: "Request",
          icon: "fa-shopping-basket",
          route: "/request-ingredient",
          permission: "Navigation_Request_Ingredient",
          group: "Inventory Management"
        },
        {
          id: "material-requisition",
          title: "MRF/PR",
          icon: "fa-file-alt",
          route: "/material-requisition",
          permission: "Navigation_Material_Requisition",
          group: "Inventory Management"
        },
        {
          id: "transfer-ingredient",
          title: "Transfer",
          icon: "fas fa-truck",
          route: "/transfer-ingredient",
          permission: "Navigation_Transfer_Ingredient",
          group: "Inventory Management"
        },
        // {
        //   id: "receiving",
        //   title: "Receiving",
        //   icon: "fa-truck-ramp-box",
        //   route: "/receiving",
        //   permission: "Navigation_Receiving",
        //   group: "Inventory Management"
        // },
      ],
    },
    {
      id: "transactions",
      title: "Transactions",
      icon: "fa-list",
      permission: "Navigation_Sales_Transaction",
      isDropdown: true,
      groupBy: true,
      items: [
        {
          title: "Collected Orders",
          icon: "fa-box-archive",
          route: "/collected-orders",
          permission: "Navigation_Collected_Orders",
          group: "Order Management"
        },
        {
          title: "Customer Orders",
          icon: "fa-users",
          route: "/customer-orders",
          permission: "Navigation_Customer_Orders",
          group: "Order Management"
        },
        {
          title: "Payments",
          icon: "fa-money-bill-wave",
          route: "/payments",
          permission: "Navigation_Payments",
          group: "Financial"
        },
        {
          title: "Sales",
          icon: "fa-chart-simple",
          route: "/sales",
          permission: "Navigation_Sales",
          group: "Financial"
        },
        {
          title: "Customers",
          icon: "fa-user-group",
          route: "/customers",
          permission: "Navigation_Customers",
          group: "Customer Management"
        },
        {
          title: "Tables",
          icon: "fa-table",
          route: "/restaurant-tables",
          permission: "Navigation_Tables",
          group: "Restaurant Management"
        },
      ],
    },
    {
      id: "buffet",
      title: "Buffet",
      icon: "fa-plate-wheat",
      permission: "Navigation_Buffet",
      isDropdown: true,
      groupBy: true,
      items: [
        {
          title: "Buffet List",
          icon: "fa-list-check",
          route: "/buffet",
          permission: "Navigation_Buffet_List",
          group: "Buffet Management"
        },
        {
          title: "Buffet Categories",
          icon: "fa-layer-group",
          route: "/buffet-categories",
          permission: "Navigation_Buffet_Category",
          group: "Buffet Management"
        },
      ],
    },
    {
      id: "meals",
      title: "Menu",
      icon: "fa-utensils",
      permission: "Navigation_Meals",
      isDropdown: true,
      groupBy: true,
      items: [
        {
          title: "Menu List",
          icon: "fa-book-open",
          route: "/menus",
          permission: "Navigation_Meals_List",
          group: "Menu Management"
        },
        {
          title: "Menu Categories",
          icon: "fa-tags",
          route: "/meal-categories",
          permission: "Navigation_Meals_Category",
          group: "Menu Management"
        },
      ],
    },
    {
      id: "ingredients",
      title: "Ingredients",
      icon: "fa-carrot",
      permission: "Navigation_Ingredients",
      isDropdown: true,
      groupBy: true,
      items: [
        {
          title: "Ingredients List",
          icon: "fa-boxes-stacked",
          route: "/ingredients",
          permission: "Navigation_Ingredients_List",
          group: "Ingredient Management"
        },
        {
          title: "Productions List",
          icon: "fa-industry",
          route: "/productions",
          permission: "Navigation_Productions_List",
          group: "Production Management"
        },
        {
          title: "Butchery List",
          icon: "fa-drumstick-bite",
          route: "/butchers",
          permission: "Navigation_Butcher_List",
          group: "Production Management"
        },
        {
          title: "Suppliers",
          icon: "fa-box",
          route: "/suppliers",
          permission: "Navigation_Suppliers",
          group: "Supplier Management"
        },
        {
          title: "Ingredients Categories",
          icon: "fa-folder-tree",
          route: "/ingredient-categories",
          permission: "Navigation_Ingredient_Category",
          group: "Ingredient Management"
        },
      ],
    },
    // {
    //   id: 'analytics',
    //   title: 'Analytics',
    //   icon: 'fa-chart-pie',
    //   permission: 'Navigation_Analytics',
    //   isDropdown: true,
    //   items: [

    //     {
    //       title: 'Statistics',
    //       icon: 'fa-chart-bar',
    //       route: '/statistics',
    //       permission: 'Navigation_Analytics_Statistics'
    //     }
    //   ]
    // },
    {
      id: "reports",
      title: "Reports",
      icon: "fa-chart-line",
      permission: "Navigation_Reports",
      isDropdown: true,
      groupBy: true,
      items: [
        // {
        //   title: "Receiving Report",
        //   icon: "fa-truck-ramp-box",
        //   route: "/receiving",
        //   permission: "Navigation_Receiving",
        //   group: "Inventory Reports"
        // },
        {
          title: "Variance Report",
          icon: "fa-scale-balanced",
          route: "/variance",
          permission: "Navigation_Variance",
          group: "Inventory Reports"
        },
        {
          title: "Scrap Report",
          icon: "fa-trash-can",
          route: "/scrap-report",
          permission: "Navigation_Scrap_Report",
          group: "Inventory Reports"
        },
         {
          title: "Excel Report",
          icon: "fa-folder-open",
          route: "/excel-report",
          permission: "Navigation_Excel_Report",
          group: "Inventory Reports"
        },
        {
          title: "Butchery Report",
          icon: "fa-drumstick-bite",
          route: "/butchery-report",
          permission: "Navigation_Butchery_Report",
          group: "Production Reports"
        },
        {
          title: "Production Report",
          icon: "fa-industry",
          route: "/production-report",
          permission: "Navigation_Production_Report",
          group: "Production Reports"
        },
        {
          title: "Physical Count Report",
          icon: "fa-clipboard-check",
          route: "/physical-count-report",
          permission: "Navigation_Physical_Count_Report",
          group: "Inventory Reports"
        },
        {
          title: "Charts",
          icon: "fa-chart-column",
          route: "/charts",
          permission: "Navigation_Analytics_Charts",
          group: "Analytics"
        },
        {
          title: "Stock Monitoring",
          icon: "fa-boxes",
          route: "/stock-monitoring-report",
          permission: "Navigation_Stock_Monitoring_Report",
          group: "Inventory Reports"
        },
      ],
    },
    {
      id: "settings",
      title: "Settings",
      icon: "fa-cogs",
      permission: "Navigation_Settings",
      isDropdown: true,
      groupBy: true,
      items: [
        {
          title: "My Profile",
          icon: "fa-user",
          route: "/profiles",
          permission: "Navigation_Profile",
          group: "Account Management"
        },
        {
          title: "Users",
          icon: "fa-users-gear",
          route: "/users",
          permission: "Navigation_Users",
          group: "User Management"
        },
        {
          title: "Employees",
          icon: "fa-sliders",
          route: "/employees",
          permission: "Navigation_Employees",
          group: "System Configuration"
        },
        {
          title: "Configuration",
          icon: "fa-sliders",
          route: "/configurations",
          permission: "Navigation_Configurations",
          group: "System Configuration"
        },
        {
          title: "Logs",
          icon: "fa-clipboard-list",
          route: "/logs",
          permission: "Navigation_Logs",
          group: "Account Management"
        },
      ],
    },
  ],
};
