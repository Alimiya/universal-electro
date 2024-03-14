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

    document.addEventListener('scroll', () => {
        const footerHeight = $('footer').outerHeight();
        const height = window.innerHeight;
        const scrollableHeight = document.documentElement.scrollHeight - height;
        const uniqChatButton = document.querySelector('.uniq-chat-button');
    
        const distanceToFooter = scrollableHeight - window.scrollY;
    
        const interpolationFactor = Math.min(1, distanceToFooter / footerHeight);
    
        let bottomValue = 20 + (footerHeight * (1 - interpolationFactor));
    
        if (window.innerWidth < 800) {
            uniqChatButton.style.position = 'fixed';
            uniqChatButton.style.bottom = '20px';
            uniqChatButton.style.right = '20px';
        } else {
            uniqChatButton.style.position = 'absolute';
            uniqChatButton.style.bottom = `${bottomValue}px`;
            uniqChatButton.style.right = '20px';
        }
    });
    
});

