package com.sunushop.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public String uploadImage(MultipartFile file, String publicId) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Le fichier est vide");
        }
        
        // Verifier le type de fichier
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("Le fichier doit etre une image");
        }

        // Uploader sur Cloudinary
        Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                "public_id", publicId,
                "folder", "sunushop/articles",
                "overwrite", true,
                "resource_type", "image"
        ));

        String secureUrl = (String) uploadResult.get("secure_url");
        log.info("Image uploadee sur Cloudinary : {}", secureUrl);
        return secureUrl;
    }

    public void deleteImage(String publicId) {
        try {
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            log.info("Image supprimee de Cloudinary : {}", publicId);
        } catch (IOException e) {
            log.error("Erreur lors de la suppression de l'image : {}", e.getMessage());
        }
    }
}