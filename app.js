phonon.options({
    navigator: {
        defaultPage: 'home',
        animatePages: true,
        enableBrowserBackButton: true,
        templateRootDirectory: './tpl'
    },
    i18n: {
        directory: 'res/lang/',
        localeFallback: 'en',
        localePreferred: 'fr'
    }
});


var app = phonon.navigator();

phonon.i18n().bind();

/**
 * The activity scope is not mandatory.
 * For the home page, we do not need to perform actions during
 * page events such as onCreate, onReady, etc
 */
app.on({page: 'home', preventClose: false, content: null});

/**
 * However, on the second page, we want to define the activity scope.
 * [1] On the create callback, we add tap events on buttons. The OnCreate callback is called once.
 * [2] If the user does not tap on buttons, we cancel the page transition. preventClose => true
 * [3] The OnReady callback is called every time the user comes on this page,
 * here we did not implement it, but if you do, you can use readyDelay to add a small delay
 * between the OnCreate and the OnReady callbacks
 */
app.on({page: 'pagetwo', preventClose: true, content: 'pagetwo.html', readyDelay: 1}, function(activity) {

    var action = null;

    var onAction = function(evt) {
        var target = evt.target;
        action = 'ok';

        if(target.getAttribute('data-order') === 'order') {
            phonon.alert('Thank you for your order!', 'Dear customer');

        } else {
            phonon.alert('Your order has been canceled.', 'Dear customer');
        }
    };

    activity.onCreate(function() {
        document.querySelector('.order').on('tap', onAction);
        document.querySelector('.cancel').on('tap', onAction);
    });

    activity.onClose(function(self) {
        if(action !== null) {
            self.close();
        } else {
            phonon.alert('Before leaving this page, you must perform an action.', 'Action required');
        }
    });

    activity.onHidden(function() {
        action = null;
    });

    activity.onHashChanged(function(pizza) {
        document.querySelector('.pizza').textContent = pizza;
    });
});

app.on({page: 'students', preventClose: true, content: 'students.html', readyDelay: 1}, function(activity) {

    var action = null;

    var onAction = function(evt) {
        var target = evt.target;
        action = 'ok';
    };

    var newStudentPage = function(evt) {
        phonon.navigator().changePage('student', 'new')
    };


    activity.onCreate(function() {
        document.querySelectorAll('.student-list-item').on('tap', onAction);
        document.querySelector('.action-add-student').on('tap', newStudentPage);
    });

    activity.onClose(function(self) {
       self.close();
    });

    activity.onHidden(function() {
        action = null;
    });
});

app.on({page: 'student', preventClose: true, content: 'student.html', readyDelay: 1}, function(activity) {

    var action = null;

    var onSave = function(evt) {
        var target = evt.target;
        action = 'ok';
        phonon.notif('Save student #' + target.getAttribute('#data-student-id'), 1000, false, '');

        // save via ajax
    };

    activity.onCreate(function() {
        document.querySelector('.action-save-student').on('tap', onSave);
    });

    activity.onClose(function(self) {
        self.close();
    });

    activity.onHidden(function() {
        action = null;
    });

    activity.onHashChanged(function(studentId) {
        console.log("student id", studentId);

        if( studentId === 'new'){
            console.log('New student')
        } else {
            document.querySelector('.data-student-id').textContent = studentId;
        }

        getAccordion(document.querySelector('#accordion-student-lessons')).show();
    });
});



// Let's go!
app.start();