package scut.service.authority;

import scut.base.AbsModel;

/**
 * Created by Carrod on 2018/4/21.
 */
public class CurrentUser extends AbsModel {
    public CurrentUser() {
    }

    public CurrentUser(String userName) {
        this.userName = userName;
    }

    public String getUserName(){
        return this.userName;
    }

    public void setUserName(String userName){
        this.userName = userName;
    }
}
