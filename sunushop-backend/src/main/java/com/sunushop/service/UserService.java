package com.sunushop.service;

import com.sunushop.model.dto.UserDto;
import com.sunushop.model.entity.User;
import com.sunushop.model.enums.Role;
import com.sunushop.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public UserDto updateUserRole(Long id, String newRole) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
        // On convertit le String en enum Role
        try {
            Role role = Role.valueOf(newRole.toUpperCase());
            user.setRole(role);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Rôle invalide : " + newRole);
        }
        
        User saved = userRepository.save(user);
        return toDto(saved);
    }

    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
        if (user.getUsername().equals("diaraf")) {
            throw new RuntimeException("Vous ne pouvez pas supprimer le compte administrateur principal.");
        }
        
        userRepository.delete(user);
    }

    private UserDto toDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole().name()) // On convertit l'enum en String
                .build();
    }
}
