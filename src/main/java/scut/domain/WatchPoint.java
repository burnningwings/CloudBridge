package scut.domain;

import javax.persistence.*;

@Entity
public class WatchPoint {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "point_id")
    private long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "section_id",
            referencedColumnName = "section_id",
            foreignKey = @ForeignKey(name = "watch_point_section_id"))
    private Section section;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public Section getSection() {
        return section;
    }

    public void setSection(Section section) {
        this.section = section;
    }
}
