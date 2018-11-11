package scut.util;

public class ImageDataWrapper {
    private byte[] data;
    private String MIMEType;

    public ImageDataWrapper(byte[] data, String MIMEType) {
        this.data = data;
        this.MIMEType = MIMEType;
    }

    public byte[] getData() {
        return data;
    }

    public void setData(byte[] data) {
        this.data = data;
    }

    public String getMIMEType() {
        return MIMEType;
    }

    public void setMIMEType(String MIMEType) {
        this.MIMEType = MIMEType;
    }
}
