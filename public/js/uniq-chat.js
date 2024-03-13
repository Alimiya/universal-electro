var ailabs_user_info = {
    'client':'c1416',     
    'welcome_message':'Welcome to the chat 👋',
    'popup_mode':0, //0-off, 1-auto popup after 10 seconds for new users
    'input_comment': 'Type your message or /start to restart'
}; 
AILabsChatStart();

var isModalOpen = false;

$(document).ready(function(){
    // Hide button when Modal is shown
    function hideChatButton() {
        $('.uniq-chat-button').hide();
    }
    function showChatButton() {
        $('.uniq-chat-button').show();
    }
    $(document).on('show.bs.modal', '.modal', function () {
        $('.uniq-chat-button').hide();
    }).on('hidden.bs.modal', '.modal', function () {
        if ($('.modal.show').length === 0) {
            showChatButton();
        }
    });
    $('.uniq-chat-button').click(function () {
        if ($('.modal.show').length > 0) {
            hideChatButton();
        }
    });


    // Hide button when Popup Image is shown
    function hideChatButton() {
        $('.uniq-chat-button').hide();
    }
    function showChatButton() {
        $('.uniq-chat-button').show();
    }
    $('.splide__slide img, .path').click(hideChatButton);
    $('.popup-image span').click(showChatButton);

    // Move button upwards when it reaches the footer
    document.addEventListener('scroll', () => {
        const footerHeight = $('footer').outerHeight();
        const height = window.innerHeight + footerHeight
        const scrollableHeight = document.documentElement.scrollHeight - height
        const uniqChatButton = document.querySelector('.uniq-chat-button')

        if (window.scrollY >= scrollableHeight) {
            uniqChatButton.style.bottom = `${footerHeight}px`
        } else {
            uniqChatButton.style.bottom = "20px"
        }
    })
});

