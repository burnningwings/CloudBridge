package scut.service;

import org.jetbrains.annotations.NotNull;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import scut.util.ImageDataWrapper;

import java.io.*;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.function.Consumer;

@Service
public class ImageService {

    private static Map<String, String> suffixToMIME;
    private static Map<String, String> MIMEToSuffix;

    static {
        suffixToMIME = new HashMap<>();
        MIMEToSuffix = new HashMap<>();

        suffixToMIME.put("bmp", "image/bmp");
        suffixToMIME.put("gif", MediaType.IMAGE_GIF_VALUE);
        suffixToMIME.put("jpg", MediaType.IMAGE_JPEG_VALUE);
        suffixToMIME.put("png", MediaType.IMAGE_PNG_VALUE);

        for (String suffix : suffixToMIME.keySet()) {
            MIMEToSuffix.put(suffixToMIME.get(suffix), suffix);
        }
    }

    /* Checked Exception cannot be thrown in lambda, hence a wrapper method is required. */
    private static <E extends Exception> void doThrow(Exception e) throws E {
        throw (E) e;
    }

    public String getImageBaseURI(String module, long objectId) {
        return String.format("/%s/image/%d/", module, objectId);
    }

    public List<String> getImageFilenames(String module, long objectId) {
        List<String> imageFileNames = new ArrayList<>();
        try {
            forEachWithinImageDir(module, objectId, file -> {
                if (file.isFile()) {
                    imageFileNames.add(file.getName());
                }
            });
        } catch (IOException e) {
            return imageFileNames;
        }
        return imageFileNames;
    }

    @NotNull
    public List<String> getImageURIs(String module, long objectId) {
        List<String> imageURIs = new ArrayList<>();
        String imageBaseURI = getImageBaseURI(module, objectId);
        try {
            forEachWithinImageDir(module, objectId, file -> {
                if (file.isFile()) {
                    imageURIs.add(imageBaseURI + file.getName());
                }
            });
        } catch (IOException e) {
            return imageURIs;
        }
        return imageURIs;
    }

    public void saveImage(String module, long objectId, String MIMEType, MultipartFile imageFile) throws IOException {
        if (!MIMEToSuffix.containsKey(MIMEType)) {
            throw new IOException(String.format("Unsupported MIMEType: %s", MIMEType));
        }
        saveImage(getImageDirPath(module, objectId), MIMEToSuffix.get(MIMEType), imageFile.getBytes());
    }

    private void saveImage(Path imageDirPath, String suffix, byte[] imageBytes) throws IOException {
        File newImageFile = getNewImageFilePath(imageDirPath, suffix).toFile();

        BufferedOutputStream out = new BufferedOutputStream(new FileOutputStream(newImageFile));
        out.write(imageBytes);
        out.flush();
        out.close();
    }

    public ImageDataWrapper loadImage(String module, long objectId, String imageBaseName) throws IOException {
        /* Parameter imageBaseName is the image file name without suffix. */

        /* Variable used in lambda expression should be final or effectively final. */
        final String[] suffix = {""};
        final File[] imageFile = {new File(".")};

        forEachWithinImageDir(module, objectId, file -> {
            if (file.isFile()) {
                String[] imageNameSeg = file.getName().split("\\.");
                if (imageBaseName.equals(imageNameSeg[0])) {
                    suffix[0] = imageNameSeg[1];
                    imageFile[0] = file;
                }
            }
        });

        BufferedInputStream inputStream = new BufferedInputStream(new FileInputStream(imageFile[0]));
        byte[] data = new byte[(int) (imageFile[0].length())];
        inputStream.read(data);
        inputStream.close();

        if (!suffixToMIME.containsKey(suffix[0])) {
            throw new IOException(String.format("Unsupported file type: %s", suffix[0]));
        }

        return new ImageDataWrapper(data, suffixToMIME.get(suffix[0]));
    }

    public void deleteImage(String module, long objectId, String imageBaseName) throws IOException {
        final boolean[] deleted = {false};

        forEachWithinImageDir(module, objectId, file -> {
            if (file.isFile() && file.getName().startsWith(imageBaseName)) {
                if (file.delete()) {
                    deleted[0] = true;
                } else {
                    doThrow(new IOException(String.format("Failed to delete: %s", file.getAbsolutePath())));
                }
            }
        });

        if (!deleted[0]) {
            throw new IOException(String.format("Failed to delete image with basename: %s", imageBaseName));
        }
    }

    private void forEachWithinImageDir(String module, long objectId, Consumer<File> consumer) throws IOException {
        forEachWithinImageDir(getImageDirPath(module, objectId), consumer);
    }

    private void forEachWithinImageDir(@NotNull Path imageDirPath, Consumer<File> consumer) throws IOException {
        File imageDir = imageDirPath.toFile();
        if (!imageDir.isDirectory()) {
            throw new IOException(String.format(
                "No such directory: %s", imageDir.getAbsolutePath()));
        }

        // Method listFiles() called on an empty directory will not return null.
        File[] files = imageDir.listFiles();
        if (files == null) {
            throw new IOException(String.format(
                "Cannot get files and directories within: %s", imageDir.getAbsolutePath()));
        }

        for (File file : new ArrayList<>(Arrays.asList(files))) {
            consumer.accept(file);
        }
    }

    private void touchImageDir(@NotNull Path imageDirPath) throws IOException {
        File imageDir = imageDirPath.toFile();

        if (!imageDir.exists()) {
            if (!imageDir.mkdirs()) {
                throw new IOException(String.format("Cannot make directory: %s", imageDir.getAbsolutePath()));
            }
        } else {
            if (!imageDir.isDirectory()) {
                throw new IOException(String.format(
                    "The path already exists but not a directory: %s", imageDir.getAbsolutePath()));
            }
        }
    }

    private Path getNewImageFilePath(Path imageDirPath, String suffix) throws IOException {
        /* Variable used in lambda expression should be final or effectively final */
        final long[] maxImageNum = {0};

        touchImageDir(imageDirPath);

        /*
//
//        // Method touchImageDir() makes sure that imageDirPath represents a valid directory.
//        File[] filesAndDirs = imageDirPath.toFile().listFiles();
//        if (filesAndDirs == null) {
//            throw new IOException(String.format(
//                "Cannot get files and directories within: %s", imageDirPath.toString()));
//        }
//
//        // Walk through the corresponding image directory to find out the
//        // maximum image number so that a new image number can be evaluated.
//        for (File f : new ArrayList<>(Arrays.asList(filesAndDirs))) {
        */
        forEachWithinImageDir(imageDirPath, file -> {
            if (!file.isDirectory()) {
                try {
                    maxImageNum[0] = Math.max(maxImageNum[0], Long.valueOf(file.getName().split("\\.")[0]));
                } catch (IndexOutOfBoundsException | NumberFormatException e) {
                    doThrow(new IOException(String.format(
                        "Incorrectly formatted filename: %s", file.getAbsolutePath())));
                }
            }
        });
        /* }*/

        long newImageNum = maxImageNum[0] + 1;
        return Paths.get(imageDirPath.toString(), String.format("%d.%s", newImageNum, suffix));
    }

    private Path getImageDirPath(String module, long objectId) {
        return Paths.get("images", module, Long.toString(objectId));
    }
}
