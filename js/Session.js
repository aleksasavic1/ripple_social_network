class Session {
    user_id = "";

    startSession() {
        const date = new Date();
        date.setTime(date.getTime() + (2*24*60*60*1000)); // d/h/m/s/ms
        let expires = `expires=${date.toUTCString()}`;
        document.cookie = `user_id=${this.user_id}; ${expires}`;
    }

    getSession() {
        let name = "user_id=";
        let ca = document.cookie.split(";");

        for(let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while(c.charAt(0) == " ") {
                c = c.substring(1);
            }
            if(c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }

        return "";
    }

    destroySession() {
        let cookie = document.cookie.split(";");
        let eqPos = cookie.indexOf("=");
        let name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;

        document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}