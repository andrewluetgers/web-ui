module.exports = {
    template: require('../../../views/login.html'),
    data: function() {
        return {
            username: [],
            password: []
        };
    },
    props: {

    },
    created: function() {
        console.debug('Login module created!');
    },
    methods: {
        login : function() {
            const creationStart = Date.now();
            JavaPoly.type("peergos.user.UserContext").then(function(UserContext) {
                return UserContext.ensureSignedUp('this01', 'thispassword', 8000, true);
            }).then(function(context) {
                this.$parent.currentView = 'filesystem';
                console.log(context);
                window.context = context;
                console.log("Signing in/up took " + (Date.now()-window.pageStart)+" mS from page start");
                console.log("Signing in/up took " + (Date.now()-creationStart)+" mS from function call");
            });
        }
    },
    computed: {

    }
};