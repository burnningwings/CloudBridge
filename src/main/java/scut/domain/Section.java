package scut.domain;

import javax.persistence.*;
import java.util.List;
import java.util.Set;

@Entity
public class Section {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "section_id")
    private long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "bridge_id",
            referencedColumnName = "bridge_id",
            foreignKey = @ForeignKey(name = "section_bridge_id"))
    private Bridge bridge;

    @OneToMany(mappedBy = "section")
    private List<WatchPoint> watchPoints;

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

    public List<WatchPoint> getWatchPoints() {
        return watchPoints;
    }

    public void setWatchPoints(List<WatchPoint> watchPoints) {
        this.watchPoints = watchPoints;
    }
}
