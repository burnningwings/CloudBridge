package scut.domain;

import javax.persistence.*;

@Entity
public class WatchBox {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "box_id")
    private long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "bridge_id",
            referencedColumnName = "bridge_id",
            foreignKey = @ForeignKey(name = "watch_box_bridge_id"))
    private Bridge bridge;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public Bridge getBridge() {
        return bridge;
    }

    public void setBridge(Bridge bridge) {
        this.bridge = bridge;
    }
}
