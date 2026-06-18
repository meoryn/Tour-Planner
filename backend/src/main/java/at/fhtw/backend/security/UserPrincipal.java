package at.fhtw.backend.security;

import lombok.Getter;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.User;

@Getter
public class UserPrincipal extends User {
    private final Long id;

    public UserPrincipal(Long id, String username, String password) {
        super(username, password, AuthorityUtils.NO_AUTHORITIES);
        this.id = id;
    }
}