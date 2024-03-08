module.exports = {
    profile: {
        name: 'Jon Doe',
        picture: '/cdn/dashboard/dist/img/user2-160x160.jpg',
        href: '#',
    },
    navbar: [
        {
            title: 'Dashboard',
            href: '/dashboard',

        },
        {
            title: 'Home',
            href: '/',
        }
    ],
    search: {
        function: 'searchFunction',
        class_button: 'searchFunction_btn',
        class_input: 'searchFunction_input',
    },
    messages: {
        total: 20,
        class: 'messages_action',
        all_href: '/dashboard/all_messages',
        messages:
            [
                {
                    avatar: "/cdn/dashboard/dist/img/user1-128x128.jpg",
                    name: "JhonDoe",
                    text: "Call me whenever you can...",
                    time: "3 hours ago",
                    href: "#",
                    id: "1234567890",

                }, {
                avatar: "/cdn/dashboard/dist/img/user1-128x128.jpg",
                name: "Jane doe",
                text: "I need your help...",
                time: "5 hours ago",
                href: "#",
                id: "12345698765",

            }

            ]
    },
    notifications: {
        total: 7,
        class: 'notifications_action',
        all_href: '/dashboard/all_notifications',
        notifications:
            [
                {


                    icon: "fas fa-envelope",
                    text: "4 new messages",
                    time: "3 mins",
                    href: "#",
                    id: "1234567890",

                },
                {


                    icon: "fas fa-envelope",
                    text: "9 friend request",
                    time: "1 day",
                    href: "#",
                    id: "1234567890000",

                },

            ]
    },

    main: [
        {
            type: 'dropdown',
            title: 'Dashboard',
            active: false,
            badge: false,
            badge_color: false,
            icon: 'fas fa-tachometer-alt',
            items: [
                {
                    title: 'Welcome',
                    href: '/dashboard',
                    icon: 'fas fa-tachometer-alt',
                }, {
                    title: 'Demo',
                    href: '/dashboard/demo',
                    icon: 'fas fa-tachometer-alt',
                }

            ]
        },
        {
            type: 'simple',
            title: 'welcome',
            active: false,
            badge: 0,
            badge_color: 'badge-danger',
            icon: 'fas fa-tachometer-alt',
            href: '/dashboard',

        },
        {
            type: 'divider',
            title: 'Admin',
        },
        {
            type: 'dropdown',
            title: 'Auth',
            active: false,
            badge: false,
            badge_color: false,
            icon: 'fas fa-user',
            items: [
                {
                    title: 'users',
                    active: false,
                    href: '/dashboard/users',
                    icon: 'fas fa-user',
                }

            ]
        },
        {
            type: 'simple',
            title: 'Logout',
            active: false,
            badge: false,
            badge_color: false,
            icon: 'fas fa-times',
            href: '/auth/logout',

        },
    ]
}
