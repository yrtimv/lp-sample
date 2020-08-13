(() => {
    window.$ = (selector) => document.querySelector(selector);
    window.$$ = (selector) => document.querySelectorAll(selector);

    const $form = $('.form-container');
    const $formButtonShow = $('.btn-down');
    const $formButtonClose = $('.form__close-button');

    const myForm = {
        close(event) {
            event.preventDefault();
            myForm.hide();
        },
        show() {
            $form.classList.remove('no-display');

            if ($formButtonClose) {
                $formButtonClose.addEventListener('click', myForm.close);
            }
        },
        hide() {
            $form.classList.add('no-display');

            if ($formButtonClose) {
                $formButtonClose.removeEventListener('click', myForm.close);
            }
        },
    };

    if ($formButtonShow) {
        $formButtonShow.addEventListener(
            'click',
            function (event) {
                event.preventDefault();
                myForm.show();
            },
            false
        );
    }

    window.form = myForm;
})();
